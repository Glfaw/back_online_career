import Vue from "vue";
import Vuex from "vuex";

import { getItem, setItem } from '@/utils/storage'
 
Vue.use(Vuex);

const KEY = 'ROLE_USER'

const actions = {

}

const mutations = {
  setUser(state, data) {
    state.user = data

    setItem(KEY, state.user)
  }
}

const state = {
  user: getItem(KEY)
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
});
