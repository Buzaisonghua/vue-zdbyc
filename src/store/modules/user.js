import { loginin } from '@/api/user'
import { setUser, removeUser } from '@/utils/auth'
import { operatorMenu } from '@/api/configSet'

const state = {
  roles: undefined
}

const mutations = {
  RESET_USER: (state, user) => {
    setUser(JSON.stringify(user))
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 登录
  loginin({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginin(userInfo)
        .then(res => {
          if (res.success) {
            commit('RESET_USER', res.data[0])
            resolve(res)
          } else {
            this.$message.warning(res.actionErrors)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 重置用户信息
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeUser()
      resolve()
    })
  },

  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      operatorMenu().then(res => {
        // console.log(res)
        commit('SET_ROLES', res.data)
        resolve(res.data)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
