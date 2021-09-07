import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "babel-polyfill";
import "./filter";

import "./antd-vue-components";
import "@/theme/reset.less";

import "./theme/index.scss";
import { message } from "ant-design-vue";
// import "lib-flexible";
Vue.prototype.$message = message;
message.config({
  duration: 1, // 持续时间
  top: `80px`, // 到页面顶部距离
  maxCount: 1 // 最大显示数, 超过限制时，最早的消息会被自动关闭
});

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h: any) => h(App)
}).$mount("#app");
