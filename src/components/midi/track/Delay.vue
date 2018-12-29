<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener("trackDelay", this.onMidiDelayChanged);
  },
  computed: mapState({
    trackInformation: state =>
      _.find(state.tracks, track => track.id === state.selectedTrack)
  }),
  methods: {
    onMidiDelayChanged(evt) {
      switch (evt.detail[1]) {
        case 1:
          if (this.trackInformation.delay < 5)
            this.$refs.delay.value = this.trackInformation.delay + 0.1;
          break;
        case 127:
          if (this.trackInformation.delay > 0)
            this.$refs.delay.value = this.trackInformation.delay - 0.1;
          break;
      }
    }
  }
};
</script>
