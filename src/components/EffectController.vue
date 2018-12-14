<template>
  <div class="effect-controller">
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
      <input type="radio" id="lowpass" name="filter-radios" @click="onLowRadio">
      <label for="lowpass">low</label>
      <input type="radio" id="highpass" name="filter-radios" @click="onHighRadio">
      <label for="highpass">high</label>
      <input type="radio" id="off" name="filter-radios" checked @click="onFilterOffRadio">
      <label for="off">off</label>
  </div>
</template>

<script>
import Slider from "@/components/Slider.vue";

export default {
  name: "EffectController",
  components: {
    Slider
  },
  methods: {
    onLowRadio() {
      this.$audio.lowpass.connect(this.$audio.gain);
      this.$audio.highpass.disconnect(this.$audio.gain);
    },
    onHighRadio() {
      this.$audio.lowpass.disconnect(this.$audio.gain);
      this.$audio.highpass.connect(this.$audio.gain);
    },
    onFilterOffRadio() {
      this.$audio.connector.connect(this.$audio.gain);
      this.$audio.lowpass.disconnect(this.$audio.gain);
      this.$audio.highpass.disconnect(this.$audio.gain);
    },
    onLowpassValueChanged(lowpass) {
      this.$audio.lowpass.frequency.setValueAtTime(
        lowpass,
        this.$audio.audioContext.currentTime
      );
    },
    onHighpassValueChanged(highpass) {
      this.$audio.highpass.frequency.setValueAtTime(
        highpass,
        this.$audio.audioContext.currentTime
      );
    }
  }
};
</script>

<style lang="scss">
.effect-controller {
  display: flex;
}
</style>
