<template>
  <div class="toggle">
    <input type="checkbox" :id="id" class="toggle__checkbox" v-model="value">
    <label :for="id" class="toggle__label">{{ label }}</label>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Toggle",
  props: {
    label: {
      type: String,
      required: true
    }
  },
  data: () => ({
    value: false,
    id: _.uniqueId("toggle")
  }),
  watch: {
    value() {
      this.$emit("change", this.value);
    }
  }
};
</script>

<style lang="scss">
.toggle {
  display: inline-block;
  margin: 0 4px;
  text-align: center;
}

.toggle__checkbox {
  display: none;

  &:checked + .toggle__label {
    background-color: #cb2a32;
    border: 2px solid #a72329;
  }
}

.toggle__label {
  user-select: none;
  color: #fff;
  font-family: "Roboto Mono";
  font-size: 0.8rem;

  background-color: #048ba8;
  border: 2px solid #04728a;
  border-radius: 2px;
  padding: 4px;
}
</style>
