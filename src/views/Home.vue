<template>
  <div class="home">
    <Visualization/>
    <div class="data-controller">
      <Controller/>
      <EffectController/>
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="audio/*"
        style="display: none;"
        @change="onLoadSample"
      >
      <button class="loader" @click="onStartLoad">Load Sample</button>
    </div>
    <Sequencer/>
  </div>
</template>

<script>
import { actionTypes } from "@/store";
import Controller from "@/components/Controller.vue";
import EffectController from "@/components/EffectController.vue";
import Sequencer from "@/components/Sequencer.vue";
import Visualization from "@/components/Visualization.vue";

import _ from "lodash";


export default {
  name: "home",
  components: {
    Sequencer,
    EffectController,
    Controller,
    Visualization
  },
  methods: {
    onStartLoad(evt) {
      evt.preventDefault();
      this.$refs.fileInput.click();
    },

    onLoadSample(evt) {
      evt.preventDefault();
      _.forEach(
        this.$refs.fileInput.files,
        _.bind(function(file) {
          this.$store.dispatch(actionTypes.LOAD_SAMPLE, {
            file,
            audioContext: this.$audio.audioContext
          });
        }, this)
      );
    }
  }
};
</script>

<style lang="scss">
.data-controller {
  display: flex;
  align-items: center;
  height: 10vh;
}
</style>
