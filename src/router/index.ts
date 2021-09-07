import Vue from "vue";
import VueRouter from "vue-router";

import userRoute from "@/views/main/user/route";
import documentRoute from "@/views/main/document/route";
import ocrRoute from "@/views/main/OCR/route";
import orderRoute from "@/views/order/confirm/route";

Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to: any) {
  //@ts-ignore
  return VueRouterPush.call(this, to).catch((err: any) => err);
};

const routes = [
  // 有首页的时候设为首页
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "index" */ "@/views/index/Index.vue")
  },
  // 登录与否都跳到首页
  {
    path: "/main/index",
    name: "mainIndex",
    redirect: "/main/document/HomePage"
  },
  {
    path: "/main",
    name: "main",
    component: () =>
      import(/* webpackChunkName: "main" */ "@/views/main/Index.vue"),
    children: [userRoute, documentRoute, ocrRoute]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/Index.vue")
  },
  {
    path: "/logout",
    name: "logout",
    component: () =>
      import(/* webpackChunkName: "index" */ "@/views/index/Index.vue")
  },
  {
    path: "/Register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "regiser" */ "@/views/login/Register.vue")
  },
  {
    path: "/orderlogin",
    name: "OrderLogin",
    component: () =>
      import(
        /* webpackChunkName: "orderlogin" */ "@/views/login/OrderLogin.vue"
      )
  },
  {
    path: "/order",
    name: "orderIndex",
    component: () =>
      import(/* webpackChunkName: "order" */ "@/views/order/Index.vue"),
    children: [orderRoute]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
