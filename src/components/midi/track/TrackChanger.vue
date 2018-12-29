<script>
import { mapState } from "vuex";
import { mutationTypes } from "@/store";

export default {
  mounted() {
    this.$midi.eventBus.addEventListener("track_changed", this.onTrackChanged);
  },
  methods: {
    onTrackChanged(evt) {
      this.$store.commit(
        mutationTypes.SET_SELECTED_TRACK,
        evt.detail[0].trackId
      );
    }
  }
};
</script>
