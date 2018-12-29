import _ from "lodash";
import Vue from "vue";
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
    dataArray
};

const eventBus = new EventTarget();
Vue.prototype.$midi = {
    eventBus
};

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(
        midiAccess => {
            eventBus.addEventListener("track_changed", evt =>
                console.log(evt.detail)
            );
            Vue.prototype.$midi = {
                active: true,
                midiAccess,
                eventBus
            };

            for (let input of midiAccess.inputs.values()) {
                input.onmidimessage = function (evt) {
                    const note = evt.data[1];
                    const mapping = _(mappings)
                        .values()
                        .find(mapping => mapping.keyCode === note);

                    if (!_.isUndefined(mapping)) {
                        const event = new CustomEvent(mapping.event, {
                            detail: mapping.data
                        });
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
let camera = new THREE.PerspectiveCamera(100, 1, 1, 1000);
let renderer;

Vue.prototype.$three = {scene, camera, renderer};

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
