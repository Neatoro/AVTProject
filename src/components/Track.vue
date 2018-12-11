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
    <input type="checkbox" class="checkbox" v-model="active">
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
import Slider from "@/components/Slider.vue";
import Step from "@/components/Step.vue";

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
    active: true,
    selectedSample: null,
    source: null,
    lowpass: null,
    highpass: null,
    gain: null,
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
  mounted() {
    this.gain = this.$audio.audioContext.createGain();
    this.lowpass = this.$audio.audioContext.createBiquadFilter();
    this.lowpass.type = "lowpass";
    this.highpass = this.$audio.audioContext.createBiquadFilter();
    this.highpass.type = "highpass";
    this.lowpass
      .connect(this.highpass)
      .connect(this.gain)
      .connect(this.$audio.connector);
    console.log(undefined);
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
    }
  },
  methods: {
    onVolumeChange(volume) {
      this.gain.gain.value = volume / 100;
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
      const shouldPlay = this.stepData[this.currentColumn];
      if (shouldPlay && !_.isNil(this.sample) && this.active) {
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
