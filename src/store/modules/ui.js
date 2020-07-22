export const namespaced = true;

export const state = () => ({
  authoring: false,
});

export const getters = {
  authoring: (state) => state.authoring,
};

export const mutations = {
  SET_AUTHORING(state, authoring) {
    state.authoring = authoring;
  },
};

export const actions = {
  setAuthoring({ commit }, authoring) {
    commit("SET_AUTHORING", authoring);
  },
};
