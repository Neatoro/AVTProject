<template>
  <div class="home">
    <Visualization/>
    <div class="data-controller">
      <Controller/>
      <EffectController/>
      <button class="loader">Load Sample</button>
    </div>
    <Sequencer/>
  </div>
</template>

<script>
import Controller from "@/components/Controller.vue";
import EffectController from "@/components/EffectController.vue";
import Sequencer from "@/components/Sequencer.vue";
import Visualization from "@/components/Visualization.vue";

export default {
  name: "home",
  components: {
    Sequencer,
    EffectController,
    Controller,
    Visualization
  }
};
</script>

<style lang="scss">
.data-controller {
  display: flex;
  align-items: center;
  height: 10vh;
}
</style>
