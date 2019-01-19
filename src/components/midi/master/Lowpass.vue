<script>
import { mapState } from "vuex";
import { mutationTypes } from "@/store";

export default {
  computed: mapState({
    masterLowpassIsPressed: state => state.masterLowpassIsPressed
  }),
  mounted() {
    this.$midi.eventBus.addEventListener("mLowpass", this.onMidiMasterLowpass);
    this.$midi.eventBus.addEventListener(
      "masterKnob",
      this.onMidiMasterLowpassChanged
    );
  },
  methods: {
    onMidiMasterLowpass(lowpass) {
      switch (lowpass.detail[1]) {
        case 127:
          this.$store.commit(mutationTypes.MIDI_MASTER_LOWPASS_PRESSED, true);
          break;
        case 0:
          this.$store.commit(mutationTypes.MIDI_MASTER_LOWPASS_PRESSED, false);
          break;
      }
    },
    onMidiMasterLowpassChanged(lowpass) {
      if (this.masterLowpassIsPressed) {
        switch (lowpass.detail[1]) {
          case 1:
            if (this.$refs.lowpass.value < 18000) {
              if (this.$refs.lowpass.value > 17900) {
                this.$refs.lowpass.value = 18000;
              } else {
                this.$refs.lowpass.value = this.$refs.lowpass.value + 100;
              }
            }
            break;
          case 127:
            if (this.$refs.lowpass.value > 0) {
              if (this.$refs.lowpass.value < 100) {
                this.$refs.lowpass.value = 0;
              } else {
                this.$refs.lowpass.value = this.$refs.lowpass.value - 100;
              }
            }
            break;
        }
      }
    }
  }
};
</script>
