export default {
  state: { friendGroup: null, followerInfo: null },
  actions: {
    setFriendGroup: function({ commit }, group) {
      return commit("SET_friendGroup", group);
    },
    setFollowerInfo: function({ commit }, info) {
      return commit("SET_followerInfo", info);
    },
  },
  mutations: {
    SET_friendGroup: function(state, value) {
      state.friendGroup = value || null;
    },
    SET_followerInfo: function(state, value) {
      state.followerInfo = value || null;
    },
  },
  getters: {
    friendGroup: function(state) {
      return state.friendGroup;
    },
    followerInfo: function(state) {
      return state.followerInfo;
    },
  },
};
