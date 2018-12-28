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
    <Slider title="Delay" :min="0" :max="5" :defaultValue="0" :step="0.1" @change="onDelayTimeValueChange"></Slider>
    <input type="checkbox" class="checkbox" @change="onMutedChanged">
    <input type="checkbox" class="checkbox" @change="onSoloChanged">
    <Step
      ref="steps"
      v-for="n in 16"
      :key="n"
      :class="{'step--called': n - 1 === currentCo<Slider title="Delay" :min="0" :max="5" :defaultValue="0" :step="0.1" @change="onDelayTimeValueChange"></Slider>lumn}"
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
    delay: null
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
    this.delay = this.$audio.audioContext.createDelay(5);

    const analyser = this.$audio.audioContext.createAnalyser();

    this.lowpass
      .connect(this.highpass)
      .connect(this.gain)
      .connect(this.$audio.connector);
    this.gain.connect(this.delay).connect(this.$audio.connector);


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
    ["trackInformation.volume"]() {
      this.gain.gain.value = this.trackInformation.volume / 100;
    }
  },
  methods: {
    onDelayTimeValueChange(delay) {
      this.delay.delayTime.setValueAtTime(
        delay,
        this.$audio.audioContext.currentTime
      );
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
    onLowpassValueChanged(lowpass) {
      this.lowpass.frequency.setValueAtTime(
        lowpass,
        this.$audio.audioContext.currentTime
      );
    },
    onHighpassValueChanged(highpass) {
      this.highpass.frequency.setValueAtTime(
        highpass,
        this.$audio.audioContext.currentTime
      );
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
