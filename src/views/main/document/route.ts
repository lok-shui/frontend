export default {
  path: "document",
  name: "document",
  component: () => import(/* webpackChunkName: "document" */ "./Index.vue"),
  children: [
    {
      path: "insertDoc/:id",
      name: "insertDoc",
      component: () => import("./InsertDoc.vue")
    },
    {
      path: "interfaceDoc/:id",
      name: "interfaceDoc",
      component: () => import("./InterfaceDoc.vue")
    },
    {
      path: "apiStandard",
      name: "apiStandard",
      component: () => import("./apiStandard.vue")
    },
    // add new   path: "ApiPower/:id",
    // {
    //   path: "ApiPower/:id",
    //   name: "ApiPower",
    //   component: () => import("./ApiPower.vue")
    // },
    {
      path: "ApiPower/:type/:id",
      name: "ApiPower",
      component: () => import("./ApiPower.vue")
    },
    {
      path: "HomePage",
      name: "HomePage",
      component: () => import("./HomePage.vue")
    },
    {
      path: "ApplicationPage",
      name: "ApplicationPage",
      component: () => import("./ApplicationPage.vue")
    },
    {
      path: "ContactUs",
      name: "ContactUs",
      component: () => import("./ContactUs.vue")
    }
  ]
};
