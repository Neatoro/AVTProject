<template>
  <div class="track">
    <select class="sample-select" v-model="selectedSample">
      <option v-for="sample in sampleNames" :key="sample">{{ sample }}</option>
    </select>
    <Slider title="Volume" :min="0" :max="100" :defaultValue="100" @change="onVolumeChange"></Slider>
    <Slider
      title="Lowpass"
      :min="0"
      :max="18000"
      :defaultValue="18000"
      @change="onLowpassValueChanged"
    ></Slider>
    <Slider
      title="Highpass"
      :min="0"
      :max="18000"
      :defaultValue="0"
      @change="onHighpassValueChanged"
    ></Slider>
      <Slider
              title="Panning"
              :min="-1"
              :max="1"
              :step="0.1"
              :defaultValue="0"
              @change="onPanningValueChanged"
      ></Slider>
      <Slider title="lBand" :min="-40" :max="40"  :defaultValue="0" @change="onLBandChanged"></Slider>
      <Slider title="mBand" :min="-40" :max="40"  :defaultValue="0" @change="onMBandChanged"></Slider>
      <Slider title="hBand" :min="-40" :max="40" :defaultValue="0" @change="onHBandChanged"></Slider>

    <input type="checkbox" class="checkbox" @change="onMutedChanged">
    <input type="checkbox" class="checkbox" @change="onSoloChanged">
    <Step
      ref="steps"
      v-for="n in 16"
      :key="n"
      :class="{'step--called': n - 1 === currentColumn}"
      v-model="stepData[n - 1]"
    ></Step>
  </div>
</template>

<script>
import _ from "lodash";
import audioBufferSlice from "audiobuffer-slice";
import { mapState } from "vuex";
import { mutationTypes } from "@/store";
import Slider from "@/components/Slider.vue";
import Step from "@/components/Step.vue";

const INITIAL_LOWPASS_VALUE = 18000;
const INITIAL_HIGHPASS_VALUE = 0;
const INITIAL_PANNING_VALUE = 0;
const INITIAL_EQ_GAIN = 0;

export default {
  name: "Track",
  components: {
    Slider,
    Step
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    selectedSample: null,
    source: null,
    lowpass: null,
    highpass: null,
    gain: null,
    panning: null,
    lBand: null,
    mBand: null,
    hBand: null,
    stepData: _.map(_.range(0, 16), () => false)
  }),
  computed: mapState({
    sampleNames: state => _.map(state.samples, sample => sample.name),
    sample(state) {
      return _.find(
        state.samples,
        function(sample) {
          return sample.name === this.selectedSample;
        }.bind(this)
      );
    },
    trackInformation(state) {
      return _.find(state.tracks, track => track.id === this.id);
    },
    isAnySongSolo: state =>
      _(state.tracks)
        .map(track => track.solo)
        .includes(true),
    currentColumn: state => state.currentColumn,
    bpm: state => state.bpm,
    presetName: state => state.selectedPreset,
    currentPresetForTrack(state) {
      const selectedPreset = _.find(
        state.presets,
        preset => preset.name === state.selectedPreset
      );

      return _.find(
        _.get(selectedPreset, "tracks", []),
        _.bind(track => track.id === this.id, this)
      );
    }
  }),
  created() {
    this.$store.commit(mutationTypes.ADD_TRACK, {
      id: this.id,
      muted: false,
      solo: false,
      selectedSample: "",
      lowpass: INITIAL_LOWPASS_VALUE,
      highpass: INITIAL_HIGHPASS_VALUE,
      panning: INITIAL_PANNING_VALUE,
      lBand: INITIAL_EQ_GAIN,
      mBand: INITIAL_EQ_GAIN,
      hBand: INITIAL_EQ_GAIN,
      stepData: this.stepData,
      volume: 100,
      analyser: null
    });
  },
  mounted() {
    this.gain = this.$audio.audioContext.createGain();
    this.lowpass = this.$audio.audioContext.createBiquadFilter();
    this.lowpass.frequency.value = INITIAL_LOWPASS_VALUE;
    this.lowpass.type = "lowpass";
    this.highpass = this.$audio.audioContext.createBiquadFilter();
    this.highpass.type = "highpass";
    this.highpass.frequency.value = INITIAL_HIGHPASS_VALUE;
    this.panning = this.$audio.audioContext.createStereoPanner();
    this.panning.pan.value = INITIAL_PANNING_VALUE;
    this.lBand = this.$audio.audioContext.createBiquadFilter();
    this.lBand.type = "lowshelf";
    this.lBand.frequency.value = 360;
    this.lBand.gain.value = INITIAL_EQ_GAIN;
    this.mBand = this.$audio.audioContext.createBiquadFilter();
    this.mBand.type = "peaking";
    this.mBand.frequency.value = 3600;
    this.mBand.gain.value = INITIAL_EQ_GAIN;
    this.hBand = this.$audio.audioContext.createBiquadFilter();
    this.hBand.type = "lowshelf";
    this.hBand.frequency.value = 13060;
    this.hBand.gain.value = INITIAL_EQ_GAIN;
    const analyser = this.$audio.audioContext.createAnalyser();

    this.lowpass
      .connect(this.highpass)
      .connect(this.panning)
      .connect(this.lBand)
      .connect(this.mBand)
      .connect(this.hBand)
      .connect(this.gain)
      .connect(this.$audio.connector);

    this.gain.connect(analyser);

    this.$store.commit(mutationTypes.UPDATE_ANALYSER_OF_TRACK, {
      trackId: this.id,
      analyserFunction: () => analyser
    });
  },
  watch: {
    currentColumn() {
      this.play();
    },
    presetName() {
      const presetStepData = _.clone(
        _.get(this.currentPresetForTrack, "steps")
      );
      this.stepData = _.isUndefined(presetStepData)
        ? _.map(_.range(0, 16), () => false)
        : presetStepData;
    },
    stepData() {
      this.$store.commit(mutationTypes.UPDATE_STEP_DATA_OF_TRACK, {
        trackId: this.id,
        stepData: this.stepData
      });
    },
    ["trackInformation.lowpass"]() {
      this.lowpass.frequency.setValueAtTime(
        this.trackInformation.lowpass,
        this.$audio.audioContext.currentTime
      );
    },
    ["trackInformation.highpass"]() {
      this.highpass.frequency.setValueAtTime(
        this.trackInformation.highpass,
        this.$audio.audioContext.currentTime
      );
    },
    ["trackInformation.panning"]() {
      this.panning.pan.value = this.trackInformation.panning;
    },
    ["trackInformation.volume"]() {
      this.gain.gain.value = this.trackInformation.volume / 100;
    },
    ["trackInformation.lBand"]() {
      this.lBand.gain.value = this.trackInformation.lBand;
    },
    ["trackInformation.mBand"]() {
      this.mBand.gain.value = this.trackInformation.mBand;
    },
    ["trackInformation.hBand"]() {
      this.hBand.gain.value = this.trackInformation.hBand;
    }
  },
  methods: {
    onMutedChanged(evt) {
      this.$store.commit(mutationTypes.UPDATE_MUTED_OF_TRACK, {
        trackId: this.id,
        muted: evt.target.checked
      });
    },
    onSoloChanged(evt) {
      this.$store.commit(mutationTypes.UPDATE_SOLO_OF_TRACK, {
        trackId: this.id,
        solo: evt.target.checked
      });
    },
    onVolumeChange(volume) {
      this.$store.commit(mutationTypes.UPDATE_VOLUME_OF_TRACK, {
        trackId: this.id,
        volume
      });
    },
    onLowpassValueChanged(lowpass) {
      this.$store.commit(mutationTypes.UPDATE_LOWPASS_OF_TRACK, {
        trackId: this.id,
        lowpass
      });
    },
    onHighpassValueChanged(highpass) {
      this.$store.commit(mutationTypes.UPDATE_HIGHPASS_OF_TRACK, {
        trackId: this.id,
        highpass
      });
    },
    onPanningValueChanged(panning) {
      this.$store.commit(mutationTypes.UPDATE_PANNING_OF_TRACK, {
        trackId: this.id,
        panning
      });
    },
    onLBandChanged(lBand) {
      this.$store.commit(mutationTypes.UPDATE_LBAND_OF_TRACK, {
        trackId: this.id,
        lBand
      });
    },
    onMBandChanged(mBand) {
      this.$store.commit(mutationTypes.UPDATE_MBAND_OF_TRACK, {
        trackId: this.id,
        mBand
      });
    },
    onHBandChanged(hBand) {
      this.$store.commit(mutationTypes.UPDATE_HBAND_OF_TRACK, {
        trackId: this.id,
        hBand
      });
    },
    play() {
      const shouldPlay = this.trackInformation.stepData[this.currentColumn];
      if (
        shouldPlay &&
        !_.isNil(this.sample) &&
        !this.trackInformation.muted &&
        (!this.isAnySongSolo || this.trackInformation.solo)
      ) {
        this.source = this.$audio.audioContext.createBufferSource();
        this.source.connect(this.lowpass);
        audioBufferSlice(
          this.sample.data(),
          0,
          60000 / (4 * this.bpm),
          function(error, slicedBuffer) {
            this.source.buffer = slicedBuffer;
            this.source.loop = false;
            this.source.start();
          }.bind(this)
        );
      }
    }
  }
};
</script>

<style lang="scss">
.track {
  width: 100%;
  height: 10vh;
  display: flex;

  .step {
    flex: 1 0 auto;
  }
}

.sample-select {
  align-self: flex-start;
  outline: none;
}
</style>
