<template>
  <div class="controller">
    <select v-model="currentSelectedPreset">
      <option v-for="presetName in presetNames" :key="presetName">{{ presetName }}</option>
    </select>
    <button class="switch" @click="onPlayPause">{{ getPlayPauseLabel() }}</button>
    <Slider ref="volume" title="Volume" :min="0" :max="100" :defaultValue="100" @change="onMasterVolumeChanged"></Slider>
    <Slider ref="bpm" title="BPM" :min="80" :max="200" :defaultValue="80" @change="onBPMChanged"></Slider>
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
        currentSelectedPreset: "None",
        masterVolume: false,
        tempo: false
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
    mounted: function () {
        this.$midi.eventBus.addEventListener("play", this.onPlayPause);
        this.$midi.eventBus.addEventListener("masterKnob", this.onMasterMidiVolumeChanged);
        this.$midi.eventBus.addEventListener("masterKnob", this.onMidiBPMChanged);
        this.$midi.eventBus.addEventListener("mVolume", this.onMidiMasterVolume);
        this.$midi.eventBus.addEventListener("tempo", this.onMidiTempo);
        this.$midi.eventBus.addEventListener("track_changed", this.onTrackChanged);
        window.addEventListener(
            "keyup",
            function (event) {
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
        onMidiBPMChanged(bpm) {
            if(this.tempo) {
                switch (bpm.detail[1]) {
                    case 1:
                        if (this.bpm < 200)
                            this.$refs.bpm.value++;
                        break;
                    case 127:
                        if (this.bpm > 80)
                            this.$refs.bpm.value--;
                        break;
                }
            }
        },
        onMasterVolumeChanged(volume) {
            this.$audio.gain.gain.value = volume / 100;
        },
        onMasterMidiVolumeChanged(volume) {
            if(this.masterVolume) {
                switch (volume.detail[1]) {
                    case 1:
                        if (this.$audio.gain.gain.value < 1)
                            this.$audio.gain.gain.value = this.$audio.gain.gain.value + 0.01;
                        break;
                    case 127:
                        if (this.$audio.gain.gain.value > 0)
                            this.$audio.gain.gain.value = this.$audio.gain.gain.value - 0.01;
                        break;
                }
                this.$refs.volume.value = Math.round(this.$audio.gain.gain.value * 100);
            }
        },
        onMidiMasterVolume(volume) {
            switch (volume.detail[1]) {
                case 127: this.masterVolume = true;
                break;
                case 0: this.masterVolume = false;
                break;
            }
        },
        onMidiTempo(tempo){
            switch (tempo.detail[1]) {
                case 127: this.tempo = true;
                    break;
                case 0: this.tempo = false;
                    break;
            }
        },
        onTrackChanged(track) {
            this.$store.commit(
                mutationTypes.SELECT_TRACK,
                track.detail[0]
            );
        }
    }
}
</script>

<style lang="scss">
.controller {
  display: flex;
}
</style>
