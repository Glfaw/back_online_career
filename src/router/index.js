import Vue from "vue";
import store from "@/store";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
    meta: {title: '欢迎登录'}
  },
  {
    path: "/",
    component: () => import("@/views/layout"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home"),
      },
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/user"),
        meta: {title: '用户管理'}
      },
      {
        path: "/role",
        name: "role",
        component: () => import("@/views/role"),
        meta: {title: '角色管理'}
      },
      {
        path: "/menu",
        name: "menu",
        component: () => import("@/views/menu"),
        meta: {title: '菜单管理'}
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard"),
        meta: {title: '数据报表'}
      },
      {
        path: "/log",
        name: "log",
        component: () => import("@/views/log"),
        meta: {title: '日志管理'}
      }
    ]
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// 前置守卫逻辑
function beforeRoute(to, from, next) {
  // 判断是否已登录
  if(to.path == '/login') next()
  else {
    // 已登录
    if(store.state.user) {
      // 保存当前页面路由
      // store.commit('SET_PATH', to.path)
      next()
    }
    else next({path: '/login'})
  }
}

// 后置守卫逻辑
function afterRoute(to, from) {
  document.title = to.meta?.title || '网上求职与招聘系统'
}

// 全局前置路由守卫
router.beforeEach(beforeRoute)
// 全局后置路由守卫
router.afterEach(afterRoute)

export default router;
