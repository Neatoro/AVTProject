<template><<<<<<< HEAD
  <div class="track" :class="{'track--selected': isSelected}">
    <button class="btn--select" @click="onSelectedTrack">Select</button>
    <v-select
      :searchable="false"
      v-model="selectedSample"
      class="avt__dropdown"
      :options="sampleNames"
    />
    <div class="toggle__group">
      <Toggle ref="muted" label="M" @change="onMutedChanged"/>
      <Toggle ref="solo" label="S" @change="onSoloChanged"/>
    </div>
    <Step
      ref="steps"
      v-for="n in 16"
      :key="n"
      :class="{'step--played': n - 1 === currentColumn}"
      v-model="stepData[n - 1]"
    ></Step>
  </div>=======
  <div class="track">
    <select class="sample-select" v-model="selectedSample" title="choose sample">
      <option v-for="sample in sampleNames" :key="sample">{{ sample }}</option>
    </select>
    <Slider
      ref="volume"
      title="Volume"
      :min="0"
      :max="100"
      :defaultValue="100"
      @change="onVolumeChange"
    ></Slider>
    <Slider
      ref="lowpass"
      title="Lowpass"
      :min="0"
      :max="18000"
      :defaultValue="18000"
      @change="onLowpassValueChanged"
    ></Slider>
    <Slider
      ref="highpass"
      title="Highpass"
      :min="0"
      :max="18000"
      :defaultValue="0"
      @change="onHighpassValueChanged"
    ></Slider>
    <Slider
      ref="panning"
      title="Panning"
      :min="-1"
      :max="1"
      :step="0.1"
      :defaultValue="0"
      @change="onPanningValueChanged"
    ></Slider>
    <Slider
      ref="lBand"
      title="lBand"
      :min="-40"
      :max="40"
      :defaultValue="0"
      @change="onLBandValueChanged"
    ></Slider>
    <Slider
      ref="mBand"
      title="mBand"
      :min="-40"
      :max="40"
      :defaultValue="0"
      @change="onMBandValueChanged"
    ></Slider>
    <Slider
      ref="hBand"
      title="hBand"
      :min="-40"
      :max="40"
      :defaultValue="0"
      @change="onHBandValueChanged"
    ></Slider>
    <input type="checkbox" class="checkbox" @change="onMutedChanged" title="check muted">
    <input type="checkbox" class="checkbox" @change="onSoloChanged" title="check solo">
    <Step
      ref="steps"
      v-for="n in 16"
      :key="n"
      :class="{'step--called': n - 1 === currentColumn}"
      v-model="stepData[n - 1]"
    ></Step>
  </div>>>>>>>> WIP midi
</template>

<script>
import _ from "lodash";
import audioBufferSlice from "audiobuffer-slice";
import { mapState } from "vuex";
import { mutationTypes } from "@/store";
import Slider from "@/components/Slider.vue";
import Step from "@/components/Step.vue";
import Toggle from "@/components/common/Toggle.vue";

const INITIAL_LOWPASS_VALUE = 18000;
const INITIAL_HIGHPASS_VALUE = 0;
const INITIAL_PANNING_VALUE = 0;
const INITIAL_EQ_GAIN = 0;

export default {
  name: "Track",
  components: {
    Slider,
    Step,
    Toggle
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    source: null,
    selectedSample: null,
    lowpass: null,
    highpass: null,
    gain: null,
    delay: null,
    panning: null,
    lBand: null,
    mBand: null,
    hBand: null,
    stepData: _.map(_.range(0, 16), () => false)
  }),
  computed: mapState({
<<<<<<< HEAD
    isSelected(state) {
      return state.selectedTrack === this.id;
    },
    masterButtonsPressed: state => state.masterButtonsPressed,
=======
    masterButtonsPressed: state => state.masterButtonsPressed,
    selectedTrack: state => state.selectedTrack,
>>>>>>> WIP midi
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
      delay: 0,
      stepData: this.stepData,
      volume: 100,
      analyser: null
    });
  },
  mounted() {
    this.$midi.eventBus.addEventListener(
      "masterKnob",
      this.onMidiVolumeChanged
    );
<<<<<<< HEAD
    this.$midi.eventBus.addEventListener(
      "trackLowpass",
      this.onMidiLowpassChanged
    );
    this.$midi.eventBus.addEventListener(
      "trackHighpass",
      this.onMidiHighpassChanged
    );
    this.$midi.eventBus.addEventListener("trackLBand", this.onMidiLBandChanged);
    this.$midi.eventBus.addEventListener("trackMBand", this.onMidiMBandChanged);
    this.$midi.eventBus.addEventListener("trackHBand", this.onMidiHBandChanged);
    this.$midi.eventBus.addEventListener(
      "trackPanning",
      this.onMidiPanningChanged
    );

=======
    this.$midi.eventBus.addEventListener("solo", this.onSoloChanged);
>>>>>>> WIP midi
    this.gain = this.$audio.audioContext.createGain();
    this.lowpass = this.$audio.audioContext.createBiquadFilter();
    this.lowpass.frequency.value = INITIAL_LOWPASS_VALUE;
    this.lowpass.type = "lowpass";
    this.highpass = this.$audio.audioContext.createBiquadFilter();
    this.highpass.type = "highpass";
    this.highpass.frequency.value = INITIAL_HIGHPASS_VALUE;
    this.delay = this.$audio.audioContext.createDelay(5);
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
<<<<<<< HEAD
    this.gain.connect(this.delay).connect(this.$audio.connector);

=======
>>>>>>> WIP midi
    this.gain.connect(analyser);
    this.$store.commit(mutationTypes.UPDATE_ANALYSER_OF_TRACK, {
      trackId: this.id,
      analyserFunction: () => analyser
    });
  },
  watch: {
    selectedSample() {
      this.resetValue({
        mutation: mutationTypes.UPDATE_LOWPASS_OF_TRACK,
        value: INITIAL_LOWPASS_VALUE,
        propName: "lowpass"
      });

      this.resetValue({
        mutation: mutationTypes.UPDATE_HIGHPASS_OF_TRACK,
        value: INITIAL_HIGHPASS_VALUE,
        propName: "highpass"
      });

      this.resetValue({
        mutation: mutationTypes.UPDATE_PANNING_OF_TRACK,
        value: INITIAL_PANNING_VALUE,
        propName: "panning"
      });

      this.resetValue({
        mutation: mutationTypes.UPDATE_LBAND_OF_TRACK,
        value: INITIAL_EQ_GAIN,
        propName: "lBand"
      });

      this.resetValue({
        mutation: mutationTypes.UPDATE_MBAND_OF_TRACK,
        value: INITIAL_EQ_GAIN,
        propName: "mBand"
      });

      this.resetValue({
        mutation: mutationTypes.UPDATE_HBAND_OF_TRACK,
        value: INITIAL_EQ_GAIN,
        propName: "hBand"
      });
    },
    currentColumn: "play",
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
    },
    ["trackInformation.delay"]() {
      this.delay.delayTime.setValueAtTime(
        this.trackInformation.delay,
        this.$audio.audioContext.currentTime
      );
    }
  },
  methods: {
    onMutedChanged(muted) {
      this.$store.commit(mutationTypes.UPDATE_MUTED_OF_TRACK, {
        trackId: this.id,
        onMidiHighpassChanged(highpass) {
          if (this.selectedTrack === this.id) {
            switch (highpass.detail[1]) {
              case 1:
                if (this.trackInformation.highpass < 18000)
                  this.$refs.highpass.value =
                    this.trackInformation.highpass + 1;
                break;
              case 127:
                if (this.trackInformation.highpass > 0)
                  this.$refs.highpass.value =
                    this.trackInformation.highpass - 1;
                break;
            }
          }
        },
        muted
      });
    },
    onSoloChanged(solo) {
      this.$store.commit(mutationTypes.UPDATE_SOLO_OF_TRACK, {
        trackId: this.id,
        solo
      });
    },
    onSelectedTrack(evt) {
      evt.preventDefault();
      this.$store.commit(mutationTypes.SET_SELECTED_TRACK, this.id);
    },
    onMidiVolumeChanged(volume) {
      if (this.selectedTrack === this.id && !this.masterButtonsPressed) {
        switch (volume.detail[1]) {
          case 1:
            if (this.trackInformation.volume < 100)
              this.$refs.volume.value = this.trackInformation.volume + 1;
            break;
          case 127:
            if (this.trackInformation.volume > 0)
              this.$refs.volume.value = this.trackInformation.volume - 1;
            break;
        }
      }
    },
    onMidiLowpassChanged(lowpass) {
      if (this.selectedTrack === this.id) {
        switch (lowpass.detail[1]) {
          case 1:
            if (this.trackInformation.lowpass < 18000)
              this.$refs.lowpass.value = this.trackInformation.lowpass + 1;
            break;
          case 127:
            if (this.trackInformation.lowpass > 0)
              this.$refs.lowpass.value = this.trackInformation.lowpass - 1;
            break;
        }
      }
    },
    onMidiHighpassChanged(highpass) {
      if (this.selectedTrack === this.id) {
        switch (highpass.detail[1]) {
          case 1:
            if (this.trackInformation.highpass < 18000)
              this.$refs.highpass.value = this.trackInformation.highpass + 1;
            break;
          case 127:
            if (this.trackInformation.highpass > 0)
              this.$refs.highpass.value = this.trackInformation.highpass - 1;
            break;
        }
      }
    }
  },
  onMidiPanningChanged(panning) {
    if (this.selectedTrack === this.id) {
      switch (panning.detail[1]) {
        case 1:
          if (this.trackInformation.panning < 1)
            this.$refs.panning.value = this.trackInformation.panning + 0.1;
          break;
        case 127:
          if (this.trackInformation.panning > -1)
            this.$refs.panning.value = this.trackInformation.panning - 0.1;
          break;
      }
    }
  },
  onMidiLBandChanged(lBand) {
    if (this.selectedTrack === this.id) {
      switch (lBand.detail[1]) {
        case 1:
          if (this.trackInformation.lBand < 40)
            this.$refs.lBand.value = this.trackInformation.lBand + 1;
          break;
        case 127:
          if (this.trackInformation.lBand > -40)
            this.$refs.lBand.value = this.trackInformation.lBand - 1;
          break;
      }
    }
  },
  onMidiMBandChanged(mBand) {
    if (this.selectedTrack === this.id) {
      switch (mBand.detail[1]) {
        case 1:
          if (this.trackInformation.mBand < 40)
            this.$refs.mBand.value = this.trackInformation.mBand + 1;
          break;
        case 127:
          if (this.trackInformation.mBand > -40)
            this.$refs.mBand.value = this.trackInformation.mBand - 1;
          break;
      }
    }
  },
  onMidiHBandChanged(hBand) {
    if (this.selectedTrack === this.id) {
      switch (hBand.detail[1]) {
        case 1:
          if (this.trackInformation.hBand < 40)
            this.$refs.hBand.value = this.trackInformation.hBand + 1;
          break;
        case 127:
          if (this.trackInformation.hBand > -40)
            this.$refs.hBand.value = this.trackInformation.hBand - 1;
          break;
      }
    }
  },
  resetValue({ mutation, value, propName }) {
    this.$store.commit(mutation, {
      trackId: this.id,
      [propName]: value
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
      if (!_.isNil(this.source)) {
        this.source.disconnect(this.lowpass);
      }

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
          if (this.trackInformation.delay !== 0) {
            setTimeout(this.source.start, this.trackInformation.delay * 1000);
          }
        }.bind(this)
      );
    }
  }
};
</script>

<style lang="scss">
.track {
  width: 100%;
  height: 5vh;
  display: flex;
  align-items: center;

  &--selected {
    height: 12vh;

    .btn--select {
      background-color: #333;
    }
  }

  .step {
    flex: 1 0 auto;
  }
}

.btn--select {
  outline: none;
  background-color: #048ba8;
  border: 2px solid #04728a;
  color: #fff;
  font-family: "Roboto Mono";
  font-size: 0.8rem;
  margin-right: 4px;
}

.avt__dropdown {
  max-width: 10vw;
  width: 10vw;
  font-family: "Roboto Mono";
  font-size: 0.8rem;
  margin-right: 16px;

  .dropdown-toggle {
    border-color: #fff;
  }

  .open-indicator:before {
    border-color: #fff;
  }

  .vs__selected-options {
    flex-wrap: unset;
    overflow: hidden;
  }

  .selected-tag {
    color: #fff;
  }

  .clear {
    display: none;
  }
}
</style>
