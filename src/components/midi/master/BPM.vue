<script>
import { mapState } from "vuex";
import { mutationTypes } from "@/store";

export default {
  computed: mapState({
    masterTempoIsPressed: state => state.masterTempoIsPressed
  }),
  mounted() {
    this.$midi.eventBus.addEventListener("tempo", this.onMidiTempo);
    this.$midi.eventBus.addEventListener("masterKnob", this.onMidiBPMChanged);
  },
  methods: {
    onMidiBPMChanged(bpm) {
      if (this.masterTempoIsPressed) {
        switch (bpm.detail[1]) {
          case 1:
            if (this.bpm < 200) this.$refs.bpm.value++;
            break;
          case 127:
            if (this.bpm > 80) this.$refs.bpm.value--;
            break;
        }
      }
    },
    onMidiTempo(tempo) {
      switch (tempo.detail[1]) {
        case 127:
          this.$store.commit(mutationTypes.MIDI_TEMPO_PRESSED, true);
          break;
        case 0:
          this.$store.commit(mutationTypes.MIDI_TEMPO_PRESSED, false);
          break;
      }
    }
  }
};
</script>
