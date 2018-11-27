import _ from "lodash";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const mutationTypes = {
  INCREMENT_TRACK_COUNT: "INCREMENT_TRACK_COUNT",
  ADD_SAMPLE: "ADD_SAMPLE"
};

export const actionTypes = {
  LOAD_SAMPLE: "LOAD_SAMPLE"
};

export default new Vuex.Store({
  state: {
    trackCount: 4,
    samples: []
  },
  mutations: {
    [mutationTypes.INCREMENT_TRACK_COUNT](state) {
      Vue.set(state, "trackCount", state.trackCount + 1);
    },
    [mutationTypes.ADD_SAMPLE](state, sample) {
      state.samples.push(sample);
    }
  },
  actions: {
    [actionTypes.LOAD_SAMPLE]({ commit }, { audioContext, file }) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
          audioContext
            .decodeAudioData(reader.result)
            .then(buffer => {
              const sample = {
                name: file.name,
                data: () => {
                  return buffer;
                }
              };

              commit(mutationTypes.ADD_SAMPLE, sample);
              resolve();
            })
            .catch(() => reject());
        });

        reader.addEventListener("error", () => reject());

        reader.readAsArrayBuffer(file);
      });
    }
  }
});
