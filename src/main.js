import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

const audioContext = new AudioContext();
const gain = audioContext.createGain();
gain.connect(audioContext.destination);

Vue.prototype.$audio = { audioContext, gain };

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
