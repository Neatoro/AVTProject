<template>
  <div class="controller">
    <h2 class="controller__title">Track Controller</h2>
    <button
      class="btn--play"
      :class="{'btn--play--active': isPlaying}"
      @click="onPlayPause"
    >{{ getPlayPauseLabel() }}</button>
    <Knob
      label="Volume"
      ref="volume"
      :min="0"
      :max="100"
      :changeFactor="0.8"
      :initialValue="100"
      @change="onVolumeChange"
    />
    <Knob
      label="Lowpass"
      ref="lowpass"
      :min="0"
      :max="18000"
      :initialValue="18000"
      :changeFactor="100"
      @change="onLowpassValueChanged"
    />
    <Knob
      label="Highpass"
      ref="highpass"
      :min="0"
      :max="18000"
      :initialValue="0"
      :changeFactor="100"
      @change="onHighpassValueChanged"
    />
    <Knob
      label="Delay"
      ref="delay"
      :min="0"
      :max="5"
      :initialValue="0"
      :changeFactor="0.1"
      :presicion="1"
      @change="onDelayValueChanged"
    />
    <Knob
      label="Panning"
      ref="panning"
      :min="-1"
      :max="1"
      :initialValue="0"
      :changeFactor="0.01"
      :presicion="2"
      @change="onPanningValueChanged"
    />
    <Knob
      label="L-Band"
      ref="lBand"
      :min="-40"
      :max="40"
      :initialValue="0"
      :changeFactor="0.5"
      @change="onLBandValueChanged"
    />
    <Knob
      label="M-Band"
      ref="mBand"
      :min="-40"
      :max="40"
      :initialValue="0"
      @change="onMBandValueChanged"
      :changeFactor="0.5"
    />
    <Knob
      label="H-Band"
      ref="hBand"
      :min="-40"
      :max="40"
      :initialValue="0"
      @change="onHBandValueChanged"
      :changeFactor="0.5"
    />
  </div>
</template>

<script>
import _ from "lodash";
import Knob from "@/components/common/Knob.vue";
import { mapState } from "vuex";
import { mutationTypes } from "@/store";
import Toggle from "@/components/common/Toggle.vue";

export default {
  name: "TrackController",
  components: {
    Knob,
    Toggle
  },
  computed: mapState({
    isPlaying: state => state.isPlaying,
    selectedTrack: state => state.selectedTrack,
    trackInformation: state =>
      _.find(state.tracks, track => track.id === state.selectedTrack)
  }),
  watch: {
    selectedTrack() {
      this.$refs.volume.value = this.trackInformation.volume;
      this.$refs.lowpass.value = this.trackInformation.lowpass;
      this.$refs.highpass.value = this.trackInformation.highpass;
      this.$refs.panning.value = this.trackInformation.panning;
      this.$refs.lBand.value = this.trackInformation.lBand;
      this.$refs.mBand.value = this.trackInformation.mBand;
      this.$refs.hBand.value = this.trackInformation.hBand;
      this.$refs.delay.value = this.trackInformation.delay;
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
    onVolumeChange(volume) {
      this.$store.commit(mutationTypes.UPDATE_VOLUME_OF_TRACK, {
        trackId: this.selectedTrack,
        volume
      });
    },
    onLowpassValueChanged(lowpass) {
      this.$store.commit(mutationTypes.UPDATE_LOWPASS_OF_TRACK, {
        trackId: this.selectedTrack,
        lowpass
      });
    },
    onHighpassValueChanged(highpass) {
      this.$store.commit(mutationTypes.UPDATE_HIGHPASS_OF_TRACK, {
        trackId: this.selectedTrack,
        highpass
      });
    },
    onDelayValueChanged(delay) {
      this.$store.commit(mutationTypes.UPDATE_DELAY_OF_TRACK, {
        trackId: this.selectedTrack,
        delay
      });
    },
    onPanningValueChanged(panning) {
      this.$store.commit(mutationTypes.UPDATE_PANNING_OF_TRACK, {
        trackId: this.selectedTrack,
        panning
      });
    },
    onLBandValueChanged(lBand) {
      this.$store.commit(mutationTypes.UPDATE_LBAND_OF_TRACK, {
        trackId: this.selectedTrack,
        lBand
      });
    },
    onMBandValueChanged(mBand) {
      this.$store.commit(mutationTypes.UPDATE_MBAND_OF_TRACK, {
        trackId: this.selectedTrack,
        mBand
      });
    },
    onHBandValueChanged(hBand) {
      this.$store.commit(mutationTypes.UPDATE_HBAND_OF_TRACK, {
        trackId: this.selectedTrack,
        hBand
      });
    }
  }
};
</script>

<style lang="scss">
.controller {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.controller__title {
  color: #fff;
  font-family: "Roboto Mono";
  font-size: 1.3rem;
  text-align: center;
  flex: 0 0 100%;
  padding: 8px 0;
}

.toggle__group {
  display: flex;
  align-self: center;

  .toggle {
    flex: 1 0 auto;
  }
}

.btn--play {
  background-color: transparent;
  border: 3px solid #44af69;
  outline: none;
  margin: 8px;
  padding: 4px;

  font-family: "Roboto Mono";
  font-size: 1.5rem;
  color: #44af69;
  align-self: center;

  &--active {
    color: #cb2a32;
    border-color: #cb2a32;
  }
}
</style>
