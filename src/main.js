import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

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

highpass
  .connect(lowpass)
  .connect(gain);
gain.connect(audioContext.destination);

Vue.prototype.$audio = {
  audioContext,
  connector,
  gain,
  lowpass,
  highpass,
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
