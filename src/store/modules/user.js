import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    id: '',
    dept: '',
    jobs: '',
    username: '',
    userid: '',
    name: '',
    dataList: [] // 初始化空数组
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_DEPT: (state, dept) => {
      state.dept = dept
    },
    SET_JOBS: (state, jobs) => {
      state.jobs = jobs
    },
    SET_username: (state, username) => {
      state.username = username
    },
    SET_userid: (state, userid) => {
      state.userid = userid
    },
    SET_name: (state, name) => {
      state.name = name
    },
    // 设置dataList的mutation
    SET_DATA_LIST(state, payload) {
      state.dataList = payload
    },
    // 可选：添加数据到dataList
    ADD_TO_DATA_LIST(state, payload) {
      state.dataList.push(payload)
    },
    // 可选：清空dataList
    CLEAR_DATA_LIST(state) {
      state.dataList = []
    }
  },

  actions: {
    // 可以添加异步操作
    setDataList({ commit }, data) {
      commit('SET_DATA_LIST', data)
    },
    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          setToken(res.token, rememberMe)
          commit('SET_TOKEN', res.token)
          setUserInfo(res.user, commit)
          const id = res.user.user.dept.id
          commit('SET_ID', id)
          const userid = res.user.user.id//用户ID
          commit('SET_userid', userid)
          const name = res.user.user.nickName//用户名称
          commit('SET_name', name)
          const dept = res.user.user.dept.name
          console.log(2222, dept)
          commit('SET_DEPT', dept)
          const jobs = res.user.user.jobs[0].name
          console.log(3333, jobs)
          commit('SET_JOBS', jobs)
          const username = res.user.user.username
          console.log(6666666, username)
          commit('SET_username', username)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res.user)
}

export default user
