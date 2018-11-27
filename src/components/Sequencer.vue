<template>
    <div class="steps">
        <Step class="row1" v-for="n in 16" :class=col(n)></Step>
        <Step class="row2" v-for="n in 16" :class=col(n)></Step>
        <Step class="row3" v-for="n in 16" :class=col(n)></Step>
        <Step class="row4" v-for="n in 16" :class=col(n)></Step>
    </div>
</template>

<script>
import Step from "@/components/Step.vue";

export default {
  name: "Sequencer",
  components: {
    Step
  },
  methods: {
    col(index) {
      return "col" + index;
    }
  }
};
</script>


<style lang="scss">
</style>
