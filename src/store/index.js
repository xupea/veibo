import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const hotword = {
  state: {
    hotword: "",
  },
  actions: {
    updateHotword: function({ commit }, data) {
      commit("UPDATE_HOTWORD", data);
    },
  },
  mutations: {
    ["UPDATE_HOTWORD"](state, data) {
      state.hotword = data;
    },
  },
  getters: {
    hotword: function(state) {
      return state.hotword;
    },
  },
};

export default new Vuex.Store({
  state: {
    curWeiboData: {},
    curGroup: null,
  },
  mutations: {
    ["SET_CUR_WB_DATA"](state, data) {
      state.curWeiboData = data;
    },
    ["SET_CUR_GROUP"](state, data) {
      state.curGroup = data;
    },
  },
  actions: {
    setCurWeiboData: function({ commit }, data) {
      commit("SET_CUR_WB_DATA", data);
    },
    setCurGroup: function({ commit }, data) {
      commit("SET_CUR_GROUP", data);
    },
  },
  modules: {
    hotword,
  },
  getters: {
    curGroup: function(state) {
      return state.curGroup;
    },
    curWeiboData: function(state) {
      return state.curWeiboData;
    },
  },
});
