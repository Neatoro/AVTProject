<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener("trackLBand", this.onMidiLBandChanged);
    this.$midi.eventBus.addEventListener("trackMBand", this.onMidiMBandChanged);
    this.$midi.eventBus.addEventListener("trackHBand", this.onMidiHBandChanged);
  },
  computed: mapState({
    trackInformation: state =>
      _.find(state.tracks, track => track.id === state.selectedTrack)
  }),
  methods: {
    onMidiLBandChanged(lBand) {
      switch (lBand.detail[1]) {
        case 1:
          if (this.trackInformation.lBand < 40)
            this.$refs.lBand.value = this.trackInformation.lBand + 1;
          break;
        case 127:
          if (this.trackInformation.lBand > -40)
            this.$refs.lBand.value = this.trackInformation.lBand - 1;
          break;
      }
    },
    onMidiMBandChanged(mBand) {
      switch (mBand.detail[1]) {
        case 1:
          if (this.trackInformation.mBand < 40)
            this.$refs.mBand.value = this.trackInformation.mBand + 1;
          break;
        case 127:
          if (this.trackInformation.mBand > -40)
            this.$refs.mBand.value = this.trackInformation.mBand - 1;
          break;
      }
    },
    onMidiHBandChanged(hBand) {
      switch (hBand.detail[1]) {
        case 1:
          if (this.trackInformation.hBand < 40)
            this.$refs.hBand.value = this.trackInformation.hBand + 1;
          break;
        case 127:
          if (this.trackInformation.hBand > -40)
            this.$refs.hBand.value = this.trackInformation.hBand - 1;
          break;
      }
    }
  }
};
</script>
