import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from "three";

Vue.config.productionTip = false;

const audioContext = new AudioContext();
const gain = audioContext.createGain();
gain.connect(audioContext.destination);
const analyser = audioContext.createAnalyser();
gain.connect(analyser);
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);

Vue.prototype.$audio = { audioContext, gain, analyser, bufferLength, dataArray };

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(120, 5, 1, 1000);
let renderer;

Vue.prototype.$three = { scene, camera, renderer };

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
