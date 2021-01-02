import { LAYOUT_SIDERBAR_WIDTH, LAYOUT_SIDERBAR_COLLAPSED_WIDTH } from '@/store/constant'
const state = {
  collapsed: false,
  contentMarginLeft: LAYOUT_SIDERBAR_WIDTH
}
const mutations = {
  SET_MENU_COLLAPSED: state => {
    state.collapsed = !state.collapsed
  },
  SET_CONTENTMARGINLEFT: state => {
    if (state.collapsed) {
      state.contentMarginLeft = LAYOUT_SIDERBAR_COLLAPSED_WIDTH
    } else {
      state.contentMarginLeft = LAYOUT_SIDERBAR_WIDTH
    }
  }
}
const actions = {
  setSidebar({ commit }) {
    commit('SET_MENU_COLLAPSED')
    commit('SET_CONTENTMARGINLEFT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
