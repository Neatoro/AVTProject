<template>
  <div class="data-controller">
    <p class="section-title">Data Manager</p>
    <div class="sample-loader">
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
  </div>
</template>

<script>
import _ from "lodash";
import { actionTypes } from "@/store";

export default {
  name: "DataController",
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
  flex-direction: column;
  padding: 8px;
}

.sample-loader {
  margin-top: 8px;

  button {
    width: 100%;
    color: #fff;
    font-family: "Roboto Mono";
    font-size: 0.8rem;
    background-color: #048ba8;
    border: 2px solid #04728a;
    border-radius: 2px;
  }
}
</style>
