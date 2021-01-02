import Vue from 'vue'
import Vuex from 'vuex'

import layout from './modules/layout-mode'
import menu from './modules/menu'
import routes from './modules/routes'
import user from './modules/user'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    layout,
    menu,
    routes,
    user
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
