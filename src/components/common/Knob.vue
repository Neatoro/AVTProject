<template>
  <div class="knob" @mousedown="onMouseDown">
    <p class="knob-label knob-value">{{ value.toFixed(presicion) }}</p>
    <div class="knob-grip" :style="gripStyle"></div>
    <svg viewBox="0 0 100 100" class="knob-dial">
      <path d="M20,76 A 40 40 0 1 1 80 76" fill="none" class="full-path"></path>
      <path d="M20,76 A 40 40 0 1 1 80 76" fill="none" class="part-path" :style="pathStyle"></path>
    </svg>
    <p class="knob-label">
      <nobr>{{ label }}</nobr>
    </p>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Knob",
  props: {
    label: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    presicion: {
      type: Number,
      default: 0
    },
    initialValue: {
      type: Number,
      default: undefined
    },
    changeFactor: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      value: _.isUndefined(this.initialValue) ? this.min : this.initialValue,
      startY: 0
    };
  },
  computed: {
    rotation() {
      const relativeMaxValue = this.max - this.min;
      const relativeValue = this.value - this.min;
      const relation = relativeValue / relativeMaxValue;
      return 264 * relation - 132;
    },
    gripStyle() {
      return `transform: translate(-50%, -50%) rotate(${this.rotation}deg);`;
    },
    pathStyle() {
      const offset = 184 - 184 * ((this.rotation + 132) / 264);
      return `stroke-dashoffset: ${offset};`;
    }
  },
  watch: {
    value() {
      this.$emit("change", this.value);
    }
  },
  methods: {
    onMouseDown(evt) {
      evt.preventDefault();
      this.selected = true;
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("mousemove", this.onMouseMove);
      this.startY = evt.screenY;
    },
    onMouseMove(evt) {
      evt.preventDefault();
      const delta = evt.screenY - this.startY;
      this.startY = evt.screenY;

      const newValue = this.value - this.changeFactor * delta;
      if (delta < 0) {
        this.value = Math.min(this.max, newValue);
      } else {
        this.value = Math.max(this.min, newValue);
      }

      this.$emit("change", this.value);
    },
    onMouseUp(evt) {
      evt.preventDefault();
      this.selected = false;
      document.removeEventListener("mouseup", this.onMouseUp);
      document.removeEventListener("mousemove", this.onMouseMove);
    }
  }
};
</script>

<style lang="scss">
.knob {
  width: 60px;
  height: 120px;
  position: relative;
  margin: 0 16px;

  &:first-child {
    margin: 0;
  }

  &:last-child {
    border: none;
  }
}

.knob-grip {
  width: 44px;
  height: 44px;
  background-color: #232323;
  border-radius: 50%;
  border: 6px solid #0d0b0e;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;

  &:after {
    content: "";
    position: absolute;
    height: 10px;
    width: 2px;
    top: 5px;
    left: 50%;
    background-color: #fff;
    transform: translateX(-50%);
  }
}

.knob-dial {
  pointer-events: none;
  position: absolute;
  stroke-width: 8;
  stroke-dasharray: 184 184;
  z-index: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.knob-label {
  font-family: "Roboto Mono";
  color: #fff;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  user-select: none;
}

.knob-value {
  bottom: auto;
  top: 10%;
}

.full-path {
  stroke: #4b4b4b;
}

.part-path {
  stroke: #f77f00;
}
</style>
