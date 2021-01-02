const state = {
  modetype: 'mode3'
}
const mutations = {
  SET_LYAOUT_MODE: (state, modetype) => {
    state.modetype = modetype
  }
}
const actions = {
  setLayoutMode({ commit }, modetype) {
    commit('SET_LYAOUT_MODE', modetype)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
