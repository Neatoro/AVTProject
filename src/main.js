import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

const audioContext = new AudioContext();
Vue.prototype.$audio = audioContext;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
