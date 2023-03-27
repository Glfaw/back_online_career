import Vue from "vue";
import Vuex from "vuex";

import { getItem, setItem } from '@/utils/storage'
import { getRoleList, getFirmList } from '@/api/user'
 
Vue.use(Vuex);

const USER_KEY = 'ACCOUNT_USER'
// 角色表
const ROLE_KEY = 'ROLE_POWER'
// 公司表
const FIRM_KEY = 'COMPANY_LIST'
// 当前路由
const PATH_KEY = 'PAGE_PATH'

const actions = {
  // 请求角色权限
  async loadRoles(content) {
    const res = await getRoleList();
    if(res.code == 200) {
      content.commit('SET_ROLES', res.data)
    }
  },
  // 请求所有公司列表
  async loadFirms(content) {
    const res = await getFirmList();
    if(res.code == 200) {
      content.commit('SET_FIRMS', res.data)
    }
  }
}

const mutations = {
  // 设置用户
  SET_USER(state, data) {
    state.user = data
    setItem(USER_KEY, state.user)
  },
  // 加载角色权限
  SET_ROLES(state, data) {
    state.allRoles = data
    setItem(ROLE_KEY, state.allRoles)
  },
  // 加载公司列表
  SET_FIRMS(state, data) {
    state.allFirms = data
    setItem(FIRM_KEY, state.allFirms)
  },
  SET_PATH(state, data) {
    state.pagePath = data
    setItem(PATH_KEY, state.pagePath)
  }
}

const state = {
  user: getItem(USER_KEY),
  allRoles: getItem(ROLE_KEY),
  allFirms: getItem(FIRM_KEY),
  pagePath: getItem(PATH_KEY)
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
});
