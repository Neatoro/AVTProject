<template>
  <div class="track">
    <select class="sample-select" v-model="selectedSample">
      <option v-for="sample in sampleNames" :key="sample">{{ sample }}</option>
    </select>
    <Slider title="Volume" :min="0" :max="100" :defaultValue="100" @change="onVolumeChange"></Slider>
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
    gain: null
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
    this.gain.connect(this.$audio.gain);
  },
  watch: {
    currentColumn() {
      this.play();
    }
  },
  methods: {
    onVolumeChange(volume) {
      this.gain.gain.value = volume / 100;
    },
    play() {
      const shouldPlay = this.$refs.steps[this.currentColumn].isActive;

      if (shouldPlay && !_.isNil(this.sample) && this.active) {
        this.source = this.$audio.audioContext.createBufferSource();
        this.source.connect(this.gain);

        this.source.buffer = this.sample.data();
        this.source.loop = false;
        this.source.start(0, 0, 60000 / this.bpm);
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


