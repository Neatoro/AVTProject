import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from "three";
import { CameraHelper } from "three";

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
connector.connect(highpass);
connector.connect(lowpass);
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
  dataArray,
  // helper
};

let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(30, 1, 1, 1000);
let camera = new THREE.OrthographicCamera(-900, 900, 100, -100, 1, 1000);
// let helper = new CameraHelper(camera);
// scene.add(helper);
// camera.position.z = 100;
let renderer;

Vue.prototype.$three = { scene, camera, renderer };

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
