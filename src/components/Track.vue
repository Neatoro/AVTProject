<template>
  <div class="track" :class="{'track--selected': isSelected}">
    <button class="btn--select" @click="onSelectedTrack">Select</button>
    <v-select
      :searchable="false"
      v-model="selectedSample"
      class="avt__dropdown"
      :options="sampleNames"
    />
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
    lowpass: null,
    highpass: null,
    gain: null,
    stepData: _.map(_.range(0, 16), () => false)
  }),
  computed: mapState({
    isSelected(state) {
      return state.selectedTrack === this.id;
    },
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

    const analyser = this.$audio.audioContext.createAnalyser();

    this.lowpass
      .connect(this.highpass)
      .connect(this.gain)
      .connect(this.$audio.connector);

    this.gain.connect(analyser);

    this.$store.commit(mutationTypes.UPDATE_ANALYSER_OF_TRACK, {
      trackId: this.id,
      analyserFunction: () => analyser
    });
  },
  watch: {
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
    ["trackInformation.volume"]() {
      this.gain.gain.value = this.trackInformation.volume / 100;
    }
  },
  methods: {
    onSelectedTrack(evt) {
      evt.preventDefault();
      this.$store.commit(mutationTypes.SET_SELECTED_TRACK, this.id);
    },
    play() {
      const shouldPlay = this.trackInformation.stepData[this.currentColumn];
      if (
        shouldPlay &&
        !_.isNil(this.sample) &&
        !this.trackInformation.muted &&
        (!this.isAnySongSolo || this.trackInformation.solo)
      ) {
        const source = this.$audio.audioContext.createBufferSource();
        source.connect(this.lowpass);
        audioBufferSlice(
          this.sample.data(),
          0,
          60000 / (4 * this.bpm),
          (error, slicedBuffer) => {
            source.buffer = slicedBuffer;
            source.loop = false;
            source.start();
          }
        );
      }
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
      display: none;
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
