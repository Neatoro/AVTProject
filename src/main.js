import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from "three";

Vue.config.productionTip = false;

const audioContext = new AudioContext();
const gain = audioContext.createGain();
gain.connect(audioContext.destination);

Vue.prototype.$audio = { audioContext, gain };

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(160, 5, 1, 1000);


Vue.prototype.$three = { scene, camera };

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
