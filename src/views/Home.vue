<template>
  <div class="home">
    <Visualization/>
    <MasterController/>
    <div class="tracks">
      <TrackController/>
      <Sequencer/>
    </div>
  </div>
</template>

<script>
import MasterController from "@/components/MasterController.vue";
import Sequencer from "@/components/Sequencer.vue";
import TrackController from "@/components/TrackController.vue";
import Visualization from "@/components/Visualization.vue";

export default {
  name: "home",
  components: {
    Sequencer,
    MasterController,
    TrackController,
    Visualization
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
}

.viz {
  flex: 1 0 auto;
}

.controller,
.viz {
  border-bottom: 3px solid #f77f00;
}

.tracks {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  max-height: 70vh;

  .sequencer {
    flex: 1 0 auto;
  }
}
</style>
