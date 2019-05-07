import * as types from './mutation_types';

export default {
  // 改变当前主题id
  [types.CONTENT_TITLTE] (state, id) {
    console.log(id);
    state.conntent_titlte = id;
  },
  setToken: (state, token) => {
    state.accessToken = token;
  },
  setAdmin: (state, isAdmin) => {
    state.isAdmin = isAdmin;
  },
  setUsername: (state, username) => {
    state.username = username;
  },
  flushData: (state) => {
    state.accessToken = window.localStorage.getItem('accessToken');
    state.username = window.localStorage.getItem('username');
    state.isAdmin = window.localStorage.getItem('isAdmin');
  }
};
