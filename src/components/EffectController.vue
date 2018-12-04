<template>
    <div class="effect-controller">
        <Slider title="Lowpass" :min="0" :max="18000" :defaultValue="18000"  @change="onLowpassValueChanged"></Slider>
        <Slider title="Highpass" :min="0" :max="18000" :defaultValue="0" @change="onHighpassValueChanged"></Slider>
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
