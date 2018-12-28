<template>
  <div class="sequencer">
    <Track v-for="n in trackCount" :key="n" :id="n"/>
    <button :disabled="trackCount === 8" class="adder" @click="onAddTrack">+</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mutationTypes } from "@/store";
import Track from "@/components/Track.vue";

export default {
  name: "Sequencer",
  components: {
    Track
  },
  computed: mapState({
    trackCount: state => state.trackCount
  }),
  methods: {
    onAddTrack(evt) {
      evt.preventDefault();

      this.$store.commit(mutationTypes.INCREMENT_TRACK_COUNT);
    }
  }
};
</script>


<style lang="scss">
.sequencer {
  height: 65vh;
  max-height: 65vh;
  overflow-y: scroll;
  padding: 8px;
}
</style>
