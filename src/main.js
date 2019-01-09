import Vue from "vue";
import VueSelect from "vue-select";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from "three";

Vue.config.productionTip = false;

const audioContext = new AudioContext();
const gain = audioContext.createGain();
const connector = audioContext.createGain();
const lowpass = audioContext.createBiquadFilter();
lowpass.type = "lowpass";
lowpass.frequency.value = 18000;
const highpass = audioContext.createBiquadFilter();
highpass.type = "highpass";
highpass.frequency.value = 0;
connector.connect(highpass).connect(gain);
connector.connect(lowpass).connect(gain);
gain.connect(audioContext.destination);
const analyser = audioContext.createAnalyser();
gain.connect(analyser);
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);

Vue.prototype.$audio = {
  audioContext,
  connector,
  gain,
  lowpass,
  highpass,
  analyser,
  bufferLength,
  dataArray
};

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(100, 1, 1, 1000);
let renderer;

Vue.prototype.$three = {
  scene,
  camera,
  renderer
};

Vue.component("v-select", VueSelect);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
