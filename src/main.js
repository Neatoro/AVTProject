import _ from "lodash";
import Vue from "vue";
import VueSelect from "vue-select";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from "three";
import mappings from "./mappings";

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
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
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

const eventBus = new EventTarget();
Vue.prototype.$midi = {
  eventBus
};

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(
    midiAccess => {
      Vue.prototype.$midi = {
        active: true,
        midiAccess,
        eventBus
      };

      for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = function(evt) {
          const note = evt.data[1];
          const value = evt.data[2];
          const mapping = _(mappings)
            .values()
            .find(mapping => mapping.keyCode === note);

          if (!_.isUndefined(mapping)) {
            const event = new CustomEvent(mapping.event, {
              detail: [mapping.data, value]
            });
            //console.log(event);
            eventBus.dispatchEvent(event);
          }
        };
      }
    },
    () => {
      Vue.prototype.$midi = {
        active: false
      };
    }
  );
}

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-900, 900, 100, -100, 1, 1000);
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
