import store from "@/store";
import Vue from "vue";
// import store from "@/store";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function replace (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

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
        path: "/person",
        name: "person",
        component: () => import("@/views/person"),
        meta: {title: '个人中心'}
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
  // if(to.name == 'login' || to.name == 'home') next()
  // else {
  //   if(store.state.user?.token) next()
  //   else {
  //     next()
  //   }
  // }
  next()
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
