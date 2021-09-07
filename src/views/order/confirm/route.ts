export default {
  path: "confirm",
  name: "confirm",
  component: () => import(/* webpackChunkName: "order" */ "./Index.vue"),
  children: [
    {
      path: "orderconfirm",
      name: "orderconfirm",
      component: () => import("./OrderConfirm.vue")
    }
  ]
};
