<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener(
      "trackVolume",
      this.onMidiVolumeChanged
    );
  },
  computed: mapState({
    trackInformation: state =>
      _.find(state.tracks, track => track.id === state.selectedTrack)
  }),
  methods: {
    onMidiVolumeChanged(evt) {
      switch (evt.detail[1]) {
        case 1:
          if (this.trackInformation.volume < 100)
            this.$refs.volume.value = this.trackInformation.volume + 1;
          break;
        case 127:
          if (this.trackInformation.volume > 0)
            this.$refs.volume.value = this.trackInformation.volume - 1;
          break;
      }
    }
  }
};
</script>
