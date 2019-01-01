<template>
  <div class="controller">
    <KnobGroup title="Master">
      <Knob
        label="Volume"
        :min="0"
        :max="100"
        :initialValue="100"
        :changeFactor="0.8"
        @change="onMasterVolumeChanged"
      />
      <Knob label="BPM" :min="80" :max="220" :initialValue="80" @change="onBPMChanged"/>
    </KnobGroup>
    <!-- <select v-model="currentSelectedPreset">
      <option v-for="presetName in presetNames" :key="presetName">{{ presetName }}</option>
    </select>-->
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import { actionTypes, mutationTypes } from "@/store";
import Interval from "@/utils/editableInterval";
import Knob from "@/components/common/Knob.vue";
import KnobGroup from "@/components/common/KnobGroup.vue";
import Slider from "@/components/Slider.vue";

function tick() {
  this.$store.dispatch(actionTypes.NEXT_COLUMN);
}

function start() {
  const timing = calcualteTiming(this.bpm);
  this.interval = new Interval(timing, tick.bind(this));
  this.interval.start();
}

function stop() {
  this.interval.stop();
}

function calcualteTiming(bpm) {
  return 60000 / (16 * bpm);
}

export default {
  name: "Controller",
  components: {
    Slider,
    Knob,
    KnobGroup
  },
  data: () => ({
    interval: undefined,
    currentSelectedPreset: "None"
  }),
  computed: mapState({
    isPlaying: state => state.isPlaying,
    bpm: state => state.bpm,
    presetNames: state => _.map(state.presets, preset => preset.name)
  }),
  watch: {
    isPlaying() {
      if (this.isPlaying) {
        start.bind(this)();
      } else {
        stop.bind(this)();
      }
    },
    currentSelectedPreset() {
      this.$store.commit(
        mutationTypes.SET_SELECTED_PRESET,
        this.currentSelectedPreset
      );
    },
    bpm() {
      if (!_.isUndefined(this.interval)) {
        this.interval.interval = calcualteTiming(this.bpm);
      }
    }
  },
  methods: {
    getPlayPauseLabel() {
      return this.isPlaying ? "Pause" : "Play";
    },
    onPlayPause(evt) {
      evt.preventDefault();
      this.$store.commit(mutationTypes.SET_IS_PLAYING, !this.isPlaying);
    },
    onBPMChanged(bpm) {
      this.$store.commit(mutationTypes.SET_BPM, bpm);
    },
    onMasterVolumeChanged(volume) {
      this.$audio.gain.gain.value = volume / 100;
    }
  }
};
</script>

<style lang="scss">
.controller {
  display: flex;
}
</style>
