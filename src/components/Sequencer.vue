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
  background-color: #202020;
  max-height: calc(100vh - 297px);
  overflow-y: scroll;
  padding: 8px;
  position: relative;
}

.adder {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background-color: #048ba8;
  border: 2px solid #04728a;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  font-family: "Roboto Mono";
  font-size: 1.8rem;
  outline: none;

  &:disabled {
    display: none;
  }
}
</style>
