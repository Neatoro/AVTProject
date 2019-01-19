<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener("solo", this.onMidiSoloChanged);
  },
  computed: mapState({
    selectedTrack: state => state.selectedTrack
  }),
  methods: {
    onMidiSoloChanged() {
      if (this.selectedTrack === this.id) {
        this.$refs.solo.value = !this.$refs.solo.value;
      }
    }
  }
};
</script>
