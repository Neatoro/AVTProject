<template>
  <div class="home">
    <div class="master">
      <Controller/>
      <EffectController/>
      <DataController/>
      <Visualization/>
    </div>
    <div class="tracks">
      <TrackController/>
      <Sequencer/>
    </div>
  </div>
</template>

<script>
import Controller from "@/components/Controller.vue";
import DataController from "@/components/DataController.vue";
import EffectController from "@/components/EffectController.vue";
import Sequencer from "@/components/Sequencer.vue";
import TrackController from "@/components/TrackController.vue";
import Visualization from "@/components/Visualization.vue";

export default {
  name: "home",
  components: {
    Sequencer,
    EffectController,
    Controller,
    TrackController,
    Visualization,
    DataController
  }
};
</script>

<style lang="scss">
.home {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .tracks {
    flex: 1 0 auto;
  }
}

.master {
  display: flex;
  border-bottom: 3px solid #f77f00;

  .controller,
  .effect-controller,
  .data-controller {
    border-right: 3px solid #f77f00;
  }

  .viz {
    flex: 1 0 auto;
  }
}

.tracks {
  display: flex;

  .track-controller {
    border-right: 3px solid #f77f00;
  }

  .sequencer {
    flex: 1 0 auto;
  }
}
</style>
