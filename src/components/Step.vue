<template>
  <button class="step" :class="{'step--active': isActive}" @click="onClick"></button>
</template>

<script>
export default {
  name: "Step",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { isActive: this.value };
  },
  watch: {
    value() {
      this.isActive = this.value;
    }
  },
  methods: {
    onClick(evt) {
      evt.preventDefault();
      this.isActive = !this.isActive;
      this.$emit("input", this.isActive);
    }
  }
};
</script>

<style lang="scss">
.step {
  margin: 2px;
  border: 1px solid #333;
  background-color: #ddd;
  outline: none;

  &:hover {
    background-color: #eee;
  }
}

.step--active {
  background-color: #fb0;

  &:hover {
    background-color: lighten(#fb0, 5);
  }
}

.step--called {
  border: 3px solid #00f;
}
</style>
