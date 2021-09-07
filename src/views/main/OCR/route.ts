export default {
  path: "OCR",
  name: "OCR",
  component: () => import(/* webpackChunkName: "ocr" */ "./Index.vue"),
  children: [
    {
      path: "templateList",
      name: "templateList",
      component: () => import("./templateList.vue"),
      meta: {
        keepalive: true
      }
    },
    {
      path: "templateEdit",
      name: "templateEdit",
      component: () => import("./templateEdit.vue"),
      meta: {
        keepalive: true
      }
    },
    {
      path: "classifierList",
      name: "classifierList",
      component: () => import("./classifierList.vue"),
      meta: {
        keepalive: true
      }
    },
    {
      path: "classifierEdit/:id",
      name: "classifierEdit",
      component: () => import("./classifierEdit.vue"),
      meta: {
        keepalive: true
      }
    },
    {
      path: "fieldTypeManagement",
      name: "fieldTypeManagement",
      component: () => import("./fieldTypeManagement.vue"),
      meta: {
        keepalive: true
      }
    }
  ]
};
