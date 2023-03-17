import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import '@/styles/index.less'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount("#app");
