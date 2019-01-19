<script>
import { mapState } from "vuex";
import { mutationTypes } from "@/store";

export default {
  computed: mapState({
    masterVolumeIsPressed: state => state.masterVolumeIsPressed
  }),
  mounted() {
    this.$midi.eventBus.addEventListener("mVolume", this.onMidiMasterVolume);
    this.$midi.eventBus.addEventListener(
      "masterKnob",
      this.onMasterMidiVolumeChanged
    );
  },
  methods: {
    onMidiMasterVolume(evt) {
      switch (evt.detail[1]) {
        case 127:
          this.$store.commit(mutationTypes.MIDI_MASTER_VOLUME_PRESSED, true);
          break;
        case 0:
          this.$store.commit(mutationTypes.MIDI_MASTER_VOLUME_PRESSED, false);
          break;
      }
    },
    onMasterMidiVolumeChanged(volume) {
      if (this.masterVolumeIsPressed) {
        switch (volume.detail[1]) {
          case 1:
            if (this.$refs.volume.value < 100) this.$refs.volume.value++;
            break;
          case 127:
            if (this.$refs.volume.value > 0) this.$refs.volume.value--;
            break;
        }
      }
    }
  }
};
</script>
