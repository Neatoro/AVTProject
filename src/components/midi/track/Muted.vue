<script>
import { mapState } from "vuex";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener("mute", this.onMidiMutedChanged);
  },
  computed: mapState({
    selectedTrack: state => state.selectedTrack
  }),
  methods: {
    onMidiMutedChanged() {
      if (this.selectedTrack === this.id) {
        this.$refs.muted.value = !this.$refs.muted.value;
      }
    }
  }
};
</script>
