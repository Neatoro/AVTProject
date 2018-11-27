<template>
  <button class="step" :class="{'step--active': isActive}" @click="onClick"></button>
</template>

<script>
export default {
  name: "Step",
  data() {
    return { isActive: false };
  },
  methods: {
    onClick(evt) {
      evt.preventDefault();
      this.isActive = !this.isActive;
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
</style>