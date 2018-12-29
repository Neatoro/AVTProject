<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener(
      "trackPanning",
      this.onMidiPanningChanged
    );
  },
  computed: mapState({
    trackInformation: state =>
      _.find(state.tracks, track => track.id === state.selectedTrack)
  }),
  methods: {
    onMidiPanningChanged(evt) {
      switch (evt.detail[1]) {
        case 1:
          if (this.trackInformation.panning < 1)
            this.$refs.panning.value = this.trackInformation.panning + 0.01;
          break;
        case 127:
          if (this.trackInformation.panning > -1)
            this.$refs.panning.value = this.trackInformation.panning - 0.01;
          break;
      }
    }
  }
};
</script>
