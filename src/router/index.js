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

export const setRoutes = function (){
  const treeMenu = store.state.treeMenu
  if (treeMenu.length === 0) return false

  const baseRoute = { path: '/', name: 'layout', component: () => import('@/views/layout'), redirect: '/home', children: [] }
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

  const current = router.getRoutes().map(r => r.name)
  if (!current.includes('layout')) {
    router.addRoute(baseRoute)
    router.addRoute({
      path: '/:pathMatch(.*)*',
      redirect: '/status/404'
    })
  }
}
setRoutes()

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
  document.title = to.meta?.title || '我的后台'
}

// 全局前置路由守卫
router.beforeEach(beforeRoute)
// 全局后置路由守卫
router.afterEach(afterRoute)

export default router;
