import _ from "lodash";
import presets from "./presets";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const mutationTypes = {
  INCREMENT_TRACK_COUNT: "INCREMENT_TRACK_COUNT",
  ADD_SAMPLE: "ADD_SAMPLE",
  SET_BPM: "SET_BPM",
  SET_IS_PLAYING: "SET_IS_PLAYING",
  SET_CURRENT_COLUMN: "SET_CURRENT_COLUMN",
  SET_SELECTED_PRESET: "SET_SELECTED_PRESET",
  ADD_TRACK: "ADD_TRACK",
  UPDATE_MUTED_OF_TRACK: "UPDATE_MUTED_OF_TRACK",
  UPDATE_VOLUME_OF_TRACK: "UPDATE_VOLUME_OF_TRACK",
  UPDATE_STEP_DATA_OF_TRACK: "UPDATE_STEP_DATA_OF_TRACK",
  UPDATE_LOWPASS_OF_TRACK: "UPDATE_LOWPASS_OF_TRACK",
  UPDATE_HIGHPASS_OF_TRACK: "UPDATE_HIGHPASS_OF_TRACK",
  UPDATE_ANALYSER_OF_TRACK: "UPDATE_ANALYSER_OF_TRACK",
  UPDATE_SOLO_OF_TRACK: "UPDATE_SOLO_OF_TRACK"
};

export const actionTypes = {
  LOAD_SAMPLE: "LOAD_SAMPLE",
  NEXT_COLUMN: "NEXT_COLUMN"
};

const privateMethods = {
  updateTrackData: ({ state, trackId, key, value }) => {
    const track = _.find(state.tracks, track => track.id === trackId);
    if (!_.isUndefined(track)) {
      Vue.set(track, key, value);
    }
  }
};

export default new Vuex.Store({
  state: {
    trackCount: 4,
    samples: [],
    bpm: 80,
    isPlaying: false,
    currentColumn: 0,
    selectedPreset: "None",
    presets,
    tracks: []
  },
  mutations: {
    [mutationTypes.INCREMENT_TRACK_COUNT](state) {
      Vue.set(state, "trackCount", Math.min(state.trackCount + 1, 8));
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
    },
    [mutationTypes.SET_SELECTED_PRESET](state, presetName) {
      Vue.set(state, "selectedPreset", presetName);
    },
    [mutationTypes.ADD_TRACK](state, trackData) {
      state.tracks.push(trackData);
    },
    [mutationTypes.UPDATE_VOLUME_OF_TRACK](state, { trackId, volume }) {
      privateMethods.updateTrackData({
        state,
        trackId,
        value: volume,
        key: "volume"
      });
    },
    [mutationTypes.UPDATE_MUTED_OF_TRACK](state, { trackId, muted }) {
      privateMethods.updateTrackData({
        state,
        trackId,
        value: muted,
        key: "muted"
      });
    },
    [mutationTypes.UPDATE_STEP_DATA_OF_TRACK](state, { trackId, stepData }) {
      privateMethods.updateTrackData({
        state,
        trackId,
        value: stepData,
        key: "stepData"
      });
    },
    [mutationTypes.UPDATE_LOWPASS_OF_TRACK](state, { trackId, lowpass }) {
      privateMethods.updateTrackData({
        state,
        trackId,
        value: lowpass,
        key: "lowpass"
      });
    },
    [mutationTypes.UPDATE_HIGHPASS_OF_TRACK](state, { trackId, highpass }) {
      privateMethods.updateTrackData({
        state,
        trackId,
        value: highpass,
        key: "highpass"
      });
    },
    [mutationTypes.UPDATE_ANALYSER_OF_TRACK](
      state,
      { trackId, analyser }
    ) {
      privateMethods.updateTrackData({
        state,
        trackId,
        value: analyser,
        key: "analyser"
      });
    },
    [mutationTypes.UPDATE_SOLO_OF_TRACK](state, { trackId, solo }) {
      privateMethods.updateTrackData({
        state,
        trackId,
        value: solo,
        key: "solo"
      });
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
