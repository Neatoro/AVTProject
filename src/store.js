import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const mutationTypes = {
  INCREMENT_TRACK_COUNT: "INCREMENT_TRACK_COUNT"
};

export default new Vuex.Store({
  state: {
    trackCount: 4
  },
  mutations: {
    [mutationTypes.INCREMENT_TRACK_COUNT](state) {
      Vue.set(state, "trackCount", state.trackCount + 1);
    }
  },
  actions: {}
});
