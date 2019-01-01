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
  border: none;
  background-color: #fff;
  position: relative;
  height: 80%;

  box-shadow: inset 0 0 80px 40px #333, inset 0 0 20px 10px #eee,
    0 0 2px 1px rgba(255, 255, 255, 0.3);

  margin: 4px;

  outline: none;

  &:nth-of-type(4n + 1) {
    border-right: 3px solid #a72329;
  }

  &:nth-of-type(4n - 2) {
    border-left: 3px solid #a72329;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.15) 100%
    );
  }
}

.step--active {
  box-shadow: inset 0 0 80px 40px #cb2a32, inset 0 0 200px 100px #f8333c,
    0 0 2px 1px rgba(255, 255, 255, 0.3);
}
</style>
