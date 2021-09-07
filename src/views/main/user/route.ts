export default {
  path: "user",
  name: "user",
  component: () => import(/* webpackChunkName: "user" */ "./Index.vue"),
  children: [
    {
      path: "system",
      name: "system",
      component: () => import("./System.vue"),
      meta: {
        openKeys: 0,
        keepalive: true,
        breadcrumb: ["系统概览"]
      }
    },

    {
      path: "WorkOrderList",
      name: "WorkOrderList",
      component: () => import("./WorkOrderList.vue"),
      meta: {
        openKeys: 1,
        keepalive: true,
        breadcrumb: ["我的工单"]
      }
    },
    {
      path: "WorkOrderNew",
      name: "WorkOrderNew",
      component: () => import("./WorkOrderNew.vue"),
      meta: {
        openKeys: 1,
        keepalive: true,
        breadcrumb: ["我的工单", "创建工单"]
      }
    },

    {
      path: "uselist",
      name: "uselist",
      component: () => import("./UseList.vue"),
      meta: {
        openKeys: 2,
        keepalive: true,
        breadcrumb: ["我的应用"]
      }
    },
    {
      path: "createuse",
      name: "createuse",
      component: () => import("./CreateUse.vue"),
      meta: {
        openKeys: 2,
        keepalive: true,
        breadcrumb: ["我的应用", "创建应用"]
      }
    },
    {
      path: "editor/:id",
      name: "editor",
      component: () => import("./CreateUse.vue"),
      meta: {
        openKeys: 2,
        keepalive: true,
        breadcrumb: ["我的应用", "编辑应用"]
      }
    },
    {
      path: "usedetails/:id",
      name: "usedetails",
      component: () => import("./UseDetails.vue"),
      meta: {
        openKeys: 2,
        breadcrumb: ["我的应用", "应用详情"]
      }
    },

    {
      path: "databoard",
      name: "databoard",
      component: () => import("./DataBoard.vue"),
      meta: {
        openKeys: 3,
        keepalive: true,
        breadcrumb: ["数据看板"]
      }
    },
    {
      path: "databoarddetail",
      name: "DataBoardDetail",
      component: () => import("./DataBoardDetail.vue"),
      meta: {
        openKeys: 3,
        keepalive: true,
        breadcrumb: ["数据看板", "服务使用明细"]
      }
    },
    {
      path: "databoard/:date/:serviceId/:useMethod/:billingType/:appId",
      name: "DataBoardDetail",
      component: () => import("./DataBoardDetail.vue"),
      meta: {
        openKeys: 3,
        keepalive: true,
        breadcrumb: ["数据看板", "服务使用明细"]
      }
    },
    {
      path: "billingrecords",
      name: "billingrecords",
      component: () => import("./BillingRecords.vue"),
      meta: {
        openKeys: 4,
        keepalive: true,
        breadcrumb: ["账单记录"]
      }
    },

    {
      path: "Info",
      name: "Info",
      component: () => import("./Info.vue"),
      meta: {
        keepalive: true
        // breadcrumb: ["账号信息"]
      }
    },
    {
      path: "massagecenter",
      name: "MassageCenter",
      component: () => import("./MassageCenter.vue"),
      meta: {
        keepalive: true
      }
    }

    // v1.2时的侧边目录
    // {
    //   path: "info",
    //   name: "userInfo",
    //   component: () => import("./Info.vue")
    // },
    // {
    //   path: "authorization",
    //   name: "userAuthorization",
    //   component: () => import("./Authorization.vue")
    // },
    // {
    //   path: "service",
    //   name: "userService",
    //   component: () => import("./Service.vue")
    // },
    // {
    //   path: "bill",
    //   name: "userBill",
    //   component: () => import("./Bill.vue")
    // }
  ]
};
