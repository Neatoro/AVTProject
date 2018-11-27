<template>
  <div class="track">
    <select class="sample-select">
      <option v-for="sample in sampleNames" :key="sample">{{ sample }}</option>
    </select>
    <Slider title="Volume" :min="0" :max="100" :defaultValue="100"></Slider>
    <input type="checkbox" class="checkbox" :checked="active">
    <Step v-for="n in 16" :key="n" :class="col(n)"></Step>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import Slider from "@/components/Slider.vue";
import Step from "@/components/Step.vue";

export default {
  name: "Track",
  components: {
    Slider,
    Step
  },
  data: () => ({
    active: true
  }),
  computed: mapState({
    sampleNames: state => _.map(state.samples, sample => sample.name)
  }),
  methods: {
    col(index) {
      return "col-" + index;
    }
  }
};
</script>

<style lang="scss">
.track {
  width: 100%;
  height: 10vh;
  display: flex;

  .step {
    flex: 1 0 auto;
  }
}

.sample-select {
  align-self: flex-start;
  outline: none;
}
</style>


