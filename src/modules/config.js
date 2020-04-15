export default {
  state: {
    config: {},
    login: false,
  },
  actions: {
    updateConfig: function({ commit }, config) {
      return commit("updateConfig", config);
    },
    updateLoggedin: function({ commit }, status) {
      return commit("updateLoggedin", status);
    },
  },
  mutations: {
    updateConfig: function(state, value) {
      state.config = Object.assign({}, value);
    },
    updateLoggedin: function(state, value) {
      state.login = value;
    },
  },
  getters: {
    config: function(state) {
      return state.config;
    },
    mlogin: function(state) {
      return state.login || state.config.login;
    },
  },
};
