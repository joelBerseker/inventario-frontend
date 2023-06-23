import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

const getDefaultState = () => {
  return {
    idUser: "01",
    token: "",
    refresh:"",
    id: "",
  };
};

export const store = createStore({
  state: getDefaultState(),
  getters: {
    isLoggedIn(state) {
      return state.token;
    },
    isLoggedIn2(state) {
      return state.refresh;
    },

    getId(state) {
      return state.id;
    },
    getIdUser(state) {
      return state.idUser;
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_REFRESH: (state, refresh) => {
      state.refresh = refresh;
    },
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_IDUSER: (state, idUser) => {
      state.idUser = idUser;
    },
    RESET: (state) => {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    userId: ({ commit }, { id }) => {
      commit("SET_ID", id);
    },
    IdUser: ({ commit }, { idUser }) => {
      commit("SET_IDUSER", idUser);
    },
    login: ({ commit }, { token }) => {
      commit("SET_TOKEN", token);
    },
    isLoggedIn2: ({ commit }, { refresh }) => {
      commit("SET_REFRESH", refresh);
    },
    logout: ({ commit }) => {
      commit("RESET", "");
    },
  },
  plugins: [createPersistedState()],

});
