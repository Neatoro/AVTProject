<template>
  <div class="effect-controller">
    <Slider title="Lowpass" :min="0" :max="18000"></Slider>
    <Slider title="Highpass" :min="0" :max="18000" :defaultValue="10"></Slider>
  </div>
</template>

<script>
import Slider from "@/components/Slider.vue";

export default {
  name: "EffectController",
  components: {
    Slider
  }
};
</script>

<style lang="scss">
.effect-controller {
  display: flex;
}
</style>
