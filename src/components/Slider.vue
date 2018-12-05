<template>
  <div class="slider">
    <p class="slider__title">{{title}}: {{ value }}</p>
    <input type="range" :min="min" :max="max" v-model="value" :step="step" class="slider__control">
  </div>
</template>

<script>
export default {
  name: "Slider",
  props: {
    title: String,
    min: Number,
    max: Number,
    step: Number,
    defaultValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return { value: this.defaultValue };
  },
  watch: {
    value() {
      this.onChange();
    }
  },
  methods: {
    onChange() {
      this.$emit("change", this.value);
    }
  }
};
</script>

<style lang="scss">
</style>
