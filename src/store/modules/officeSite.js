const state = {
  siteDataList: [],      // 只存储数据列表

}

const mutations = {
  // 设置数据
  SET_DATA_LIST(state, data) {
    state.siteDataList = data
  },
  
  // 清空数据
  CLEAR_DATA_LIST(state) {
    state.siteDataList = []
  },
  
}

const actions = {
  // 存储数据（可以在组件获取数据后调用）
  saveDataList({ commit }, data) {
    commit('SET_DATA_LIST', data)
  },
  
  // 清空数据
  clearDataList({ commit }) {
    commit('CLEAR_DATA_LIST')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}