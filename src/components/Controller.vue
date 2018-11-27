<template>
  <div class="controller">
    <button class="switch" @click="onPlayPause">{{ getPlayPauseLabel() }}</button>
    <Slider title="Volume" :min="0" :max="100"></Slider>
    <Slider title="BPM" :min="80" :max="200" :defaultValue="80"></Slider>
  </div>
</template>

<script>
import Slider from "@/components/Slider.vue";

export default {
  name: "Controller",
  components: {
    Slider
  },
  data: () => ({
    playing: false
  }),
  methods: {
    getPlayPauseLabel() {
      return this.playing ? "Pause" : "Play";
    },
    onPlayPause(evt) {
      evt.preventDefault();
      this.playing = !this.playing;
    }
  }
};
</script>

<style lang="scss">
.controller {
  display: flex;
}
</style>
