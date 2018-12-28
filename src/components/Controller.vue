<template>

  <div class="controller">
    <select v-model="currentSelectedPreset">
      <option v-for="presetName in presetNames" :key="presetName">{{ presetName }}</option>
    </select>
    <button class="switch" @click="onPlayPause">{{ getPlayPauseLabel() }}</button>
    <Slider title="Volume" :min="0" :max="100" :defaultValue="100" @change="onMasterVolumeChanged"></Slider>
    <Slider title="BPM" :min="80" :max="200" :defaultValue="80" @change="onBPMChanged"></Slider>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import { actionTypes, mutationTypes } from "@/store";
import Interval from "@/utils/editableInterval";
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
    Slider
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

    function stop() {
        clearInterval(this.interval);
        this.interval = undefined;
    }

    export default {
        name: "Controller",
        components: {
            Slider
        },
        data: () => ({
            interval: undefined
        }),
        computed: mapState({
            isPlaying: state => state.isPlaying,
            bpm: state => state.bpm
        }),
        watch: {
            isPlaying() {
                if (this.isPlaying) {
                    start.bind(this)();
                } else {
                    stop.bind(this)();
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
