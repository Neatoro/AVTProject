<template>
  <div class="track-controller">
    <KnobGroup title="Track Controller">
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
    </KnobGroup>
    <div class="toggle__group">
      <Toggle ref="muted" label="Mute" @change="onMutedChanged"/>
      <Toggle ref="solo" label="Solo" @change="onSoloChanged"/>
    </div>
    <button
      class="btn--play"
      :class="{'btn--play--active': isPlaying}"
      @click="onPlayPause"
    >{{ getPlayPauseLabel() }}</button>
  </div>
</template>

<script>
import Knob from "@/components/common/Knob.vue";
import KnobGroup from "@/components/common/KnobGroup.vue";
import { mapState } from "vuex";
import { mutationTypes } from "@/store";
import Toggle from "@/components/common/Toggle.vue";

export default {
  name: "TrackController",
  components: {
    Knob,
    KnobGroup,
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
      this.$refs.muted.value = this.trackInformation.muted;
      this.$refs.solo.value = this.trackInformation.solo;
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
    onMutedChanged(muted) {
      this.$store.commit(mutationTypes.UPDATE_MUTED_OF_TRACK, {
        trackId: this.selectedTrack,
        muted
      });
    },
    onSoloChanged(solo) {
      this.$store.commit(mutationTypes.UPDATE_SOLO_OF_TRACK, {
        trackId: this.selectedTrack,
        solo
      });
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
    }
  }
};
</script>

<style lang="scss">
.track-controller {
  display: flex;
  flex-direction: column;
}

.toggle__group {
  display: flex;
  margin-bottom: 8px;

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

  &--active {
    color: #cb2a32;
    border-color: #cb2a32;
  }
}
</style>
