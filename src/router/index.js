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
    path: '/status/404',
    name: '404',
    component: () => import('@/views/status/404'),
    meta: {title: '错误访问'}
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export const resetRoutes = function () {
  router.matcher = new VueRouter({
    mode: 'history',
    routes,
  });
}

export const setRoutes = function (){
  let status = false
  const treeMenu = store.state.treeMenu
  if (treeMenu === null) return status

  const baseRoute = { path: '/', name: 'layout', component: () => import('@/views/layout'), redirect: '/home', children: [
    // 默认的子菜单...
  ] }
  const current = router.getRoutes().map(r => r.name)
  if (!current.includes('layout')) {
    status = true
    treeMenu.forEach(menu => {
      if (menu.path) {
        baseRoute.children.push({
          path: menu.path.replace('/', ''),
          name: menu.path.replace('/', ''),
          component: () => import(`@/views${menu.path}`),
          meta: {
            id: menu.id,
            title: menu.name,
            icon: menu.icon,
            description: menu.description,
            ordered: menu.ordered
          }
        })
      } else if (menu.children?.length) {
        menu.children.forEach(sub => {
          if (sub.path) {
            baseRoute.children.push({
              path: sub.path.replace('/', ''),
              name: sub.path.replace('/', ''),
              component: () => import(`@/views${sub.path}`),
              meta: {
                id: sub.id,
                title: sub.name,
                icon: sub.icon,
                description: sub.description,
                ordered: sub.ordered
              }
            })
          }
        })
      }
    })
    router.addRoute(baseRoute)
  }
  return status
}
setRoutes()

// 前置守卫逻辑
function beforeRoute(to, from, next) {
  if (!to.matched.length) {
    store.state.treeMenu? next('/status/404'): next('/login')
  }
  next()
}

// 后置守卫逻辑
function afterRoute(to) {
  document.title = to.meta?.title || '我的后台'
}

// 全局前置路由守卫
router.beforeEach(beforeRoute)
// 全局后置路由守卫
router.afterEach(afterRoute)

export default router;
