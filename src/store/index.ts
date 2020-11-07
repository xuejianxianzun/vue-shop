import Vue from 'vue'
import Vuex from 'vuex'
import * as type from './type'
Vue.use(Vuex)

interface State {
  token: string;
  menuList: [];
}

export default new Vuex.Store({
  state: {
    token: '',
    menuList: []
  },
  mutations: {
    [type.setToken](state, value) {
      state.token = value
    },
    [type.clearToken](state) {
      state.token = ''
    },
    [type.setMenuList](state, value) {
      state.menuList = value
    }
  },
  actions: {
  },
  modules: {
  }
})
