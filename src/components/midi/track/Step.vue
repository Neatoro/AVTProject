<script>
import _ from "lodash";
import { mapState } from "vuex";

export default {
  mounted() {
    _.forEach(
      _.range(1, 17),
      function(i) {
        this.$midi.eventBus.addEventListener(
          "step_" + i,
          this.onMidiStepsChanged
        );
      }.bind(this)
    );
  },
  computed: mapState({
    selectedTrack: state => state.selectedTrack
  }),
  methods: {
    onMidiStepsChanged(step) {
      const stepId = step.detail[0].stepId;
      if (this.selectedTrack === this.id) {
        this.$refs.steps[stepId - 1].isActive = !this.$refs.steps[stepId - 1]
          .isActive;
      }
    }
  }
};
</script>
