import _ from "lodash";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const mutationTypes = {
  INCREMENT_TRACK_COUNT: "INCREMENT_TRACK_COUNT",
  ADD_SAMPLE: "ADD_SAMPLE",
  SET_BPM: "SET_BPM",
  SET_IS_PLAYING: "SET_IS_PLAYING",
  SET_CURRENT_COLUMN: "SET_CURRENT_COLUMN"
};

export const actionTypes = {
  LOAD_SAMPLE: "LOAD_SAMPLE",
  NEXT_COLUMN: "NEXT_COLUMN"
};

export default new Vuex.Store({
  state: {
    trackCount: 4,
    samples: [],
    bpm: 80,
    isPlaying: false,
    currentColumn: 0
  },
  mutations: {
    [mutationTypes.INCREMENT_TRACK_COUNT](state) {
      Vue.set(state, "trackCount", state.trackCount + 1);
    },
    [mutationTypes.ADD_SAMPLE](state, sample) {
      state.samples.push(sample);
    },
    [mutationTypes.SET_BPM](state, bpm) {
      Vue.set(state, "bpm", bpm);
    },
    [mutationTypes.SET_IS_PLAYING](state, isPlaying) {
      Vue.set(state, "isPlaying", isPlaying);
    },
    [mutationTypes.SET_CURRENT_COLUMN](state, currentColumn) {
      Vue.set(state, "currentColumn", currentColumn);
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
    },
    [actionTypes.NEXT_COLUMN]({ commit, state }) {
      const nextColumn = (state.currentColumn + 1) % 16;

      commit(mutationTypes.SET_CURRENT_COLUMN, nextColumn);

      return Promise.resolve();
    }
  }
});
