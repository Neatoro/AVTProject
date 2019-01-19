<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener(
      "trackHighpass",
      this.onMidiHighpassChanged
    );
  },
  computed: mapState({
    trackInformation: state =>
      _.find(state.tracks, track => track.id === state.selectedTrack)
  }),
  methods: {
    onMidiHighpassChanged(highpass) {
      switch (highpass.detail[1]) {
        case 1:
          if (this.trackInformation.highpass < 18000)
            this.$refs.highpass.value = this.trackInformation.highpass + 100;
          break;
        case 127:
          if (this.trackInformation.highpass > 0)
            this.$refs.highpass.value = this.trackInformation.highpass - 100;
          break;
      }
    }
  }
};
</script>
