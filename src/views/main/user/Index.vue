<template>
  <div class="bgContainer">
    <a-layout
      theme="light"
      :class="['userContainer', $route.meta.openKeys !== undefined ? '' : 'pl']"
    >
      <!-- 个人信息的公共页面  -->
      <a-layout-sider
        theme="light"
        class="layoutSider"
        v-show="$route.meta.openKeys !== undefined"
      >
        <!-- 路由为'账号信息'时，控制的class和key -->
        <a-menu
          :default-selected-keys="
            $route.meta.openKeys !== undefined ? [$route.meta.openKeys] : [-1]
          "
          :selectedKeys="$route.meta.openKeys !== undefined ? [openKeys] : [-1]"
          mode="inline"
        >
          <!-- 选中时的class由全局的'@primary-color'控制， 无选中时由'menuItem'控制-->
          <a-menu-item :key="index" v-for="(menu, index) in menuItems">
            <router-link :to="menu.path">
              <div class="flex">
                <span
                  v-if="menu.svgFont"
                  :class="[menu.svgFont, 'iconSize']"
                ></span>
                <div class="siderIcon" v-if="menu.icon">
                  <img
                    v-if="$route.meta.openKeys == index ? true : false"
                    :src="
                      $route.meta.openKeys == index
                        ? menu.activeIcon
                        : menu.icon
                    "
                    alt="icon"
                  />
                  <img class="hoverImg" :src="menu.activeIcon" alt="" />
                  <img
                    class="defaultImg"
                    :src="menu.icon"
                    alt=""
                    v-if="$route.meta.openKeys !== index ? true : false"
                  />
                </div>
                <span>{{ menu.label }}</span>
              </div>
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-breadcrumb>
        <a-breadcrumb-item
          v-for="(item, index) in $route.meta.breadcrumb"
          :key="index"
          >{{ item }}</a-breadcrumb-item
        >
      </a-breadcrumb>

      <a-layout-content class="layoutContent">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>

    <a-drawer
      style="display:none"
      width="480px"
      placement="right"
      :closable="false"
      :visible="isShowDrawer"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
    >
      <div class="drawerheader">
        <div>
          <span class="news">最新消息</span>
          <span class="num">(4)</span>
        </div>
        <div class="red" @click="tomassagecenter">
          <a-icon type="clock-circle" /> 查看所有消息
        </div>
      </div>
      <div class="drawercontent">
        <div class="list">
          <div class="massagetype">
            <div>平台通知</div>
            <div>2021.11.42 13:42:15</div>
          </div>
          <div class="massagecontent">
            恭喜你注册成功，完成平台设置后马上即可使用
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import LoginService from "@/service/login";
import UserService from "@/service/user";
import { cloneDeep } from "lodash";

const loginService = LoginService.getLoginService();
const userService = UserService.getUserService();

@Component
export default class User extends Vue {
  // 左侧menu栏
  menuItems: any[] = [
    {
      label: "系统概览",
      path: "/main/user/system",
      icon: require("@/assets/images/v3/as1.svg"),
      activeIcon: require("@/assets/images/v3/asiderActive1.svg")
    },
    {
      label: "工单管理",
      path: "/main/user/WorkOrderList",
      svgFont: "icon-asider2"
    },
    {
      label: "我的应用",
      path: "/main/user/uselist",
      icon: require("@/assets/images/v3/as3.svg"),
      activeIcon: require("@/assets/images/v3/asiderActive2.svg")
    },
    {
      label: "数据看板",
      path: "/main/user/databoard",
      svgFont: "icon-asider3"
    },
    {
      label: "账单记录",
      path: "/main/user/billingrecords",
      svgFont: "icon-asider5"
    }
  ];
  openKeys: number = 0;
  menuitem: any = {};
  isShowDrawer: boolean = false;

  created() {
    const path = this.$route.path;
    const menu = this.menuItems.filter(
      (item: any) => path.indexOf(item.path) !== -1
    )[0];
    this.openKeys = this.$route.meta.openKeys;
  }

  @Watch("$route.meta.openKeys", { deep: true })
  openKeyschange() {
    this.openKeys = this.$route.meta.openKeys;
    // this.$router.go(0);
  }

  @Watch("$store.state.user.showDrawer", { deep: true })
  isshowDrawer() {
    this.isShowDrawer = this.$store.state.user.showDrawer;
  }

  toPath(url: string) {
    this.$router.push(url);
  }

  tomassagecenter() {
    this.$store.commit("changeshowDrawer", false);
    this.$router.push("/main/user/massagecenter");
  }
}
</script>

<style scoped lang="scss">
@import "./css/Index.scss";
// icomoon字体
@import "../../../assets/style.css";
.iconSize {
  font-size: 20px;
  margin-right: 14px;
}
</style>
