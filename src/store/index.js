import Vue from "vue";
import Vuex from "vuex";

import { Notification } from "element-ui";
import { getItem, setItem } from '@/utils/storage'
import { getFirmList } from '@/api/user'
import { getAllRoles } from "@/api/role"
import { getDictIcon } from "@/api/menu"

Vue.use(Vuex);

function showMsg(message, title = '操作失败') {
  return Notification({
    type: 'error',
    title,
    message
  })
}

const USER_KEY = 'ACCOUNT_USER'
// 角色表
const ROLE_KEY = 'ROLE_POWER'
// 公司表
const FIRM_KEY = 'COMPANY_LIST'

const actions = {
  // 请求角色权限
  async loadRoles(content) {
    try {
      const res = await getAllRoles()
      res.code === 200? content.commit('SET_ROLES', res.data): showMsg(res.msg, '角色列表-获取失败')
    } catch (e) {
      showMsg(e.message, '角色列表-获取异常')
    }
  },
  // 请求所有公司列表
  async loadFirms(content) {
    try {
      const res = await getFirmList()
      res.code === 200? content.commit('SET_FIRMS', res.data): showMsg(res.msg, '企业列表-获取失败')
    } catch (e) {
      showMsg(e.message, '企业列表-获取异常')
    }
  },
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
}

const state = {
  user: getItem(USER_KEY),
  allRoles: getItem(ROLE_KEY),
  allFirms: getItem(FIRM_KEY),
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
});
