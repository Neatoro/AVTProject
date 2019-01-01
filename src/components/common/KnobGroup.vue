<template>
  <div class="knob-container">
    <p class="section-title">{{ title }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "KnobGroup",
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
.knob-container {
  background-color: #202020;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10vw;
}

.section-title {
  font-family: "Roboto Mono";
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #0d0b0e;
  padding-bottom: 8px;
  height: 41px;
}
</style>
