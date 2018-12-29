<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener(
      "trackLowpass",
      this.onMidiLowpassChanged
    );
  },
  computed: mapState({
    trackInformation: state =>
      _.find(state.tracks, track => track.id === state.selectedTrack)
  }),
  methods: {
    onMidiLowpassChanged(evt) {
      switch (evt.detail[1]) {
        case 1:
          if (this.trackInformation.lowpass < 18000)
            this.$refs.lowpass.value = this.trackInformation.lowpass + 100;
          break;
        case 127:
          if (this.trackInformation.lowpass > 0)
            this.$refs.lowpass.value = this.trackInformation.lowpass - 100;
          break;
      }
    }
  }
};
</script>
