import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login")
  },
  {
    path: "/",
    component: () => import("@/views/layout"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home")
      },
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/user")
      },
      {
        path: "/role",
        name: "role",
        component: () => import("@/views/role")
      },
      {
        path: "/menu",
        name: "menu",
        component: () => import("@/views/menu")
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard")
      },
      {
        path: "/log",
        name: "log",
        component: () => import("@/views/log")
      }
    ]
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
