<template>
  <div class="controller">
    <h2 class="controller__title">Master Controller</h2>
    <Knob
      ref="volume"
      label="Volume"
      :min="0"
      :max="100"
      :initialValue="100"
      :changeFactor="0.8"
      @change="onMasterVolumeChanged"
    />
    <Knob ref="bpm" label="BPM" :min="80" :max="220" :initialValue="80" @change="onBPMChanged"/>
    <Knob
      ref="lowpass"
      label="Lowpass"
      :min="0"
      :max="18000"
      :initialValue="18000"
      :changeFactor="100"
      @change="onLowpassValueChanged"
    />
    <Knob
      ref="highpass"
      label="Highpass"
      :min="0"
      :max="18000"
      :initialValue="0"
      :changeFactor="100"
      @change="onHighpassValueChanged"
    />
    <div class="sample-loader">
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="audio/*"
        style="display: none;"
        @change="onLoadSample"
      >
      <button class="loader" @click="onStartLoad">Load Samples</button>
    </div>
    <v-select
      :searchable="false"
      v-model="currentSelectedPreset"
      class="preset__selection"
      :options="presetNames"
    />
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import { actionTypes, mutationTypes } from "@/store";
import Interval from "@/utils/editableInterval";
import Knob from "@/components/common/Knob.vue";
import Slider from "@/components/Slider.vue";

import MidiVolume from "@/components/midi/master/Volume.vue";
import MidiBPM from "@/components/midi/master/BPM.vue";
import MidiHighpass from "@/components/midi/master/Highpass.vue";
import MidiLowpass from "@/components/midi/master/Lowpass.vue";
import MidiTrackChanger from "@/components/midi/track/TrackChanger.vue";

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
  name: "MasterController",
  components: {
    Slider,
    Knob
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
  mixins: [MidiVolume, MidiBPM, MidiHighpass, MidiLowpass, MidiTrackChanger],
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
  mounted: function() {
    this.$midi.eventBus.addEventListener("play", this.onPlayPause);
    window.addEventListener(
      "keyup",
      function(event) {
        //space-key
        if (event.keyCode === 32) {
          this.onPlayPause(event);
        }
      }.bind(this)
    );
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
    },
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
.controller {
  display: flex;
}

.sample-loader {
  align-self: center;

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

.preset__selection {
  align-self: center;
  max-width: 15vw;
  width: 15vw;
  font-family: "Roboto Mono";
  font-size: 0.8rem;
  margin-left: 16px;

  .dropdown-toggle {
    border-color: #fff;
  }

  .open-indicator:before {
    border-color: #fff;
  }

  .vs__selected-options {
    flex-wrap: unset;
    overflow: hidden;
  }

  .selected-tag {
    color: #fff;
  }

  .clear {
    display: none;
  }
}
</style>
