<script>
import { mapState } from "vuex";
import { mutationTypes } from "@/store";

export default {
  computed: mapState({
    masterHighpassIsPressed: state => state.masterHighpassIsPressed
  }),
  mounted() {
    this.$midi.eventBus.addEventListener(
      "mHighpass",
      this.onMidiMasterHighpass
    );
    this.$midi.eventBus.addEventListener(
      "masterKnob",
      this.onMidiMasterHighpassChanged
    );
  },
  methods: {
    onMidiMasterHighpass(highpass) {
      switch (highpass.detail[1]) {
        case 127:
          this.$store.commit(mutationTypes.MIDI_MASTER_HIGHPASS_PRESSED, true);
          break;
        case 0:
          this.$store.commit(mutationTypes.MIDI_MASTER_HIGHPASS_PRESSED, false);
          break;
      }
    },
    onMidiMasterHighpassChanged(highpass) {
      if (this.masterHighpassIsPressed) {
        switch (highpass.detail[1]) {
          case 1:
            if (this.$refs.highpass.value < 18000) {
              if (this.$refs.highpass.value > 17900) {
                this.$refs.highpass.value = 18000;
              } else {
                this.$refs.highpass.value = this.$refs.highpass.value + 100;
              }
            }
            break;
          case 127:
            if (this.$refs.highpass.value > 0) {
              if (this.$refs.highpass.value < 100) {
                this.$refs.highpass.value = 0;
              } else {
                this.$refs.highpass.value = this.$refs.highpass.value - 100;
              }
            }
            break;
        }
      }
    }
  }
};
</script>
