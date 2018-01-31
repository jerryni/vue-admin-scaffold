import api from 'api'
import * as types from '../mutation-types'

// initial state
const state = {
  navList: []
}

// getters
const getters = {
  navListLength: state => state.navList.length
}

// actions
const actions = {
  getAllNavList ({
    commit
  }) {
    return api.getAllNavList(data => {
      commit(types.RECEIVE_NAVS, {
        navList: data.navList || []
      })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_NAVS] (state, {
    navList
  }) {
    state.navList = navList
  },

  [types.ADD_TO_CART] (state, {
    id
  }) {
    state.all.find(p => p.id === id).inventory--
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
