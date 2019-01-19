<template>
  <div class="effect-controller">
    <Slider
      ref="lowpass"
      title="Lowpass"
      :min="0"
      :max="18000"
      :defaultValue="18000"
      @change="onLowpassValueChanged"
    ></Slider>
    <Slider
      ref="highpass"
      title="Highpass"
      :min="0"
      :max="18000"
      :defaultValue="0"
      @change="onHighpassValueChanged"
    ></Slider>
    <input type="radio" id="lowpass" name="filter-radios" @click="onLowRadio">
    <label for="lowpass">low</label>
    <input type="radio" id="highpass" name="filter-radios" @click="onHighRadio">
    <label for="highpass">high</label>
    <input type="radio" id="off" name="filter-radios" checked @click="onFilterOffRadio">
    <label for="off">off</label>
  </div>
</template>

<script>
import Slider from "@/components/Slider.vue";
import { mutationTypes } from "@/store";
import { mapState } from "vuex";

export default {
  name: "EffectController",
  components: {
    Slider
  },
  data: () => ({
    filterState: ""
  }),
  computed: mapState({
    masterLowpassIsPressed: state => state.masterLowpassIsPressed,
    masterHighpassIsPressed: state => state.masterHighpassIsPressed
  }),
  mounted: function() {
    this.$midi.eventBus.addEventListener("mLowpass", this.onMidiMasterLowpass);
    this.$midi.eventBus.addEventListener(
      "mHighpass",
      this.onMidiMasterHighpass
    );
    this.$midi.eventBus.addEventListener(
      "masterKnob",
      this.onMidiMasterLowpassChanged
    );
    this.$midi.eventBus.addEventListener(
      "masterKnob",
      this.onMidiMasterHighpassChanged
    );
    this.onFilterOffRadio();
  },
  methods: {
    onLowRadio() {
      if (this.filterState !== "low") {
        this.$audio.lowpass.connect(this.$audio.gain);
        if (this.filterState === "high") {
          this.$audio.highpass.disconnect(this.$audio.gain);
        } else if (this.filterState === "off") {
          this.$audio.connector.disconnect(this.$audio.gain);
        }
        this.filterState = "low";
      }
    },
    onHighRadio() {
      if (this.filterState !== "high") {
        this.$audio.highpass.connect(this.$audio.gain);
        if (this.filterState === "low") {
          this.$audio.lowpass.disconnect(this.$audio.gain);
        } else if (this.filterState === "off") {
          this.$audio.connector.disconnect(this.$audio.gain);
        }
        this.filterState = "high";
      }
    },
    onFilterOffRadio() {
      if (this.filterState === "high") {
        this.$audio.highpass.disconnect(this.$audio.gain);
      } else if (this.filterState === "low") {
        this.$audio.lowpass.disconnect(this.$audio.gain);
      }
      if (this.filterState !== "off") {
        this.$audio.connector.connect(this.$audio.gain);
        this.filterState = "off";
      }
    },
    onLowpassValueChanged(lowpass) {
      this.$audio.lowpass.frequency.setValueAtTime(
        lowpass,
        this.$audio.audioContext.currentTime
      );
    },
    onMidiMasterLowpass(lowpass) {
      switch (lowpass.detail[1]) {
        case 127:
          this.$store.commit(mutationTypes.MIDI_MASTER_LOWPASS_PRESSED, true);
          break;
        case 0:
          this.$store.commit(mutationTypes.MIDI_MASTER_LOWPASS_PRESSED, false);
          break;
      }
    },
    onMidiMasterLowpassChanged(lowpass) {
      if (this.masterLowpassIsPressed) {
        switch (lowpass.detail[1]) {
          case 1:
            if (this.$refs.lowpass.value < 18000) {
              if (this.$refs.lowpass.value > 17900) {
                this.$refs.lowpass.value = 18000;
              } else {
                this.$refs.lowpass.value = this.$refs.lowpass.value + 100;
              }
            }
            break;
          case 127:
            if (this.$refs.lowpass.value > 0) {
              if (this.$refs.lowpass.value < 100) {
                this.$refs.lowpass.value = 0;
              } else {
                this.$refs.lowpass.value = this.$refs.lowpass.value - 100;
              }
            }

            break;
        }
      }
    },
    onHighpassValueChanged(highpass) {
      this.$audio.highpass.frequency.setValueAtTime(
        highpass,
        this.$audio.audioContext.currentTime
      );
    }
  }
};
</script>
<style lang="scss">
.effect-controller {
  display: flex;
}
</style>
