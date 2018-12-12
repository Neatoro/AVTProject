<template>
    <div class="track">
        <select class="sample-select" v-model="selectedSample">
            <option v-for="sample in sampleNames" :key="sample">{{ sample }}</option>
        </select>
        <Slider title="Volume" :min="0" :max="100" :defaultValue="100" @change="onVolumeChange"></Slider>
        <Slider title="Lowpass" :min="0" :max="18000" :defaultValue="18000" @change="onLowpassValueChanged"></Slider>
        <Slider title="Highpass" :min="0" :max="18000" :defaultValue="0" @change="onHighpassValueChanged"></Slider>
        <Slider title="Delay" :min="0" :max="5" :defaultValue="0" :step="0.1" @change="onDelayTimeValueChange"></Slider>
        <input type="checkbox" class="checkbox" v-model="active">
        <Step ref="steps" v-for="n in 16" :key="n" :class="{'step--called': n - 1 === currentColumn}"></Step>
    </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import Slider from "@/components/Slider.vue";
import Step from "@/components/Step.vue";

export default {
  name: "Track",
  components: {
    Slider,
    Step
  },
  data: () => ({
    active: true,
    selectedSample: null,
    source: null,
    lowpass: null,
    highpass: null,
    gain: null,
    delay: null
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
    bpm: state => state.bpm
  }),
  mounted() {
    this.gain = this.$audio.audioContext.createGain();
    this.lowpass = this.$audio.audioContext.createBiquadFilter();
    this.lowpass.type = "lowpass";
    this.highpass = this.$audio.audioContext.createBiquadFilter();
    this.highpass.type = "highpass";
    this.delay = this.$audio.audioContext.createDelay(5);
    this.lowpass
      .connect(this.highpass)
      .connect(this.gain)
      .connect(this.$audio.connector);
    this.gain.connect(this.delay).connect(this.$audio.connector);
  },
  watch: {
    currentColumn() {
      this.play();
    }
  },
  methods: {
    onDelayTimeValueChange(delay) {
      this.delay.delayTime.setValueAtTime(
        delay,
        this.$audio.audioContext.currentTime
      );
    },
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
      const shouldPlay = this.$refs.steps[this.currentColumn].isActive;
      if (shouldPlay && !_.isNil(this.sample) && this.active) {
        this.source = this.$audio.audioContext.createBufferSource();
        this.source.connect(this.lowpass);
        this.source.buffer = this.sample.data();
        this.source.loop = false;
        this.source.start(0);
        // this.source.start(0);
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
