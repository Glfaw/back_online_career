import Vue from "vue";
import Vuex from "vuex";
import {getAllRoles} from "@/api/role"
import {ShowNotify} from "@/utils/common"
import {getItem, setItem} from '@/utils/storage'
import {loadRouteMenu} from '@/api/purview'
import {resetRoutes} from '@/router'
import {getAllFirm} from '@/api/firm'

Vue.use(Vuex);

const USER_KEY = 'ACCOUNT_USER'
// 角色表
const ROLE_KEY = 'ROLE_POWER'
// 公司表
const FIRM_KEY = 'COMPANY_LIST'

const MENU_KEY = 'MENU_USER'

function notify(title, message, type = 'warning') {
  ShowNotify({type, title, message})
}

const actions = {
  // 请求角色权限
  async loadRoles(content) {
    try {
      const {code, data, msg} = await getAllRoles()
      code === 200
        ? content.commit('SET_ROLES', data)
        : notify('角色列表-获取失败', msg)
    } catch (e) {
      notify('角色列表-获取异常', e.message, 'error')
    }
  },
  // 请求所有公司列表
  async loadFirms(content) {
    try {
      const {code, data, msg} = await getAllFirm()
      code === 200
        ? content.commit('SET_FIRMS', data)
        : notify('企业列表-获取失败', msg)
    } catch (e) {
      notify('企业列表-获取异常', e.message, 'error')
    }
  },
  // 加载菜单
  async loadMenus(content, user) {
    resetRoutes()
    try {
      const {code, data, msg} = await loadRouteMenu(user)
      code === 200
        ? content.commit('SET_MENUS', data)
        : notify('用户菜单-获取失败', msg)
    } catch (e) {
      notify('用户菜单-获取异常', e.message, 'error')
    }
  },
  // 退出登录
  userLogOut(content) {
    content.commit('SET_USER', null)
    content.commit('SET_ROLES', null)
    content.commit('SET_FIRMS', null)
    content.commit('SET_MENUS', null)

    resetRoutes()
  }
}

const mutations = {
  // 设置用户
  async SET_USER(state, data) {
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
  SET_MENUS(state, data) {
    state.treeMenu = data
    setItem(MENU_KEY, state.treeMenu)
  },
}

const state = {
  user: getItem(USER_KEY),
  allRoles: getItem(ROLE_KEY),
  allFirms: getItem(FIRM_KEY),
  treeMenu: getItem(MENU_KEY)
}

export default new Vuex.Store({
  state,
  actions,
  mutations
});
