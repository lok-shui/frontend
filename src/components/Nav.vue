<template>
  <div class="nav-contain1">
    <div :class="navStyle">
      <!-- logo and OCR -->
      <div class="logoOcr">
        <!-- logo -->
        <div class="logo" @click="homePage">
          <img src="@/assets/images/v2/DAIP_logo.svg" alt="" />
        </div>
        <!-- OCR -->
        <div v-if="showOcr" class="ocrStyle">
          <a-dropdown>
            <div
              :class="templateRed == true ? 'antActive' : 'ocr-dropdown-link'"
              @click="toTemplage"
            >
              <img
                v-if="templateRed == true"
                src="@/assets/images/v3/templateActive.svg"
                alt=""
              />
              <img
                v-if="templateRed == false"
                src="@/assets/images/v3/template.svg"
                alt=""
              />
              <span class="words">模板管理</span>
            </div>
          </a-dropdown>
          <a-dropdown style="display: none;">
            <div
              :class="classifierRed == true ? 'antActive' : 'ocr-dropdown-link'"
              @click="toClassifier"
            >
              <img
                v-if="classifierRed == false"
                src="@/assets/images/v3/classification.svg"
                alt=""
              />
              <img
                v-if="classifierRed == true"
                src="@/assets/images/v3/classificationActive.svg"
                alt=""
              />
              <span class="words">分类器管理</span>
            </div>
          </a-dropdown>
          <a-dropdown>
            <div
              :class="filedTypeRed == true ? 'antActive' : 'ocr-dropdown-link'"
              @click="toFieldType"
            >
              <img
                v-if="filedTypeRed == false"
                src="@/assets/images/v3/field.svg"
                alt=""
              />
              <img
                v-if="filedTypeRed == true"
                src="@/assets/images/v3/fieldActive.svg"
                alt=""
              />
              <span class="words">字段类型管理</span>
            </div>
          </a-dropdown>
        </div>
      </div>

      <!-- 导航 start -->
      <div class="menu" v-if="showNav">
        <a-menu v-model="current" mode="horizontal">
          <!-- 首页 -->
          <a-dropdown>
            <a
              @click="homePage"
              :class="homeRed == true ? 'antActive' : 'ant-dropdown-link'"
              >首页
            </a>
          </a-dropdown>
          <!-- AI能力 -->
          <a-dropdown>
            <a
              :class="powerRed == true ? 'antActive' : 'ant-dropdown-link'"
              @click="e => e.preventDefault()"
              >AI能力
            </a>
            <a-menu slot="overlay" class="skill">
              <a-menu-item class="menuBox">
                <div
                  class="item"
                  v-for="(item, index) in secondCxt"
                  :key="index"
                >
                  <div class="classify">{{ item.level1 }}</div>
                  <div class="level2" v-for="(g, i) in item.level2" :key="i">
                    <div class="gname">{{ g.gname }}</div>
                    <div>
                      <span
                        v-for="(s, si) in g.services"
                        :key="si"
                        @click="toDetail(s.id, s.showUrl, $event)"
                        class="spans"
                      >
                        <span class="name">{{ s.name }}</span>
                        <span v-if="s.label" class="labels">{{ s.label }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

          <!-- 行业应用 start -->
          <a-dropdown>
            <a
              :class="industryRed == true ? 'antActive' : 'ant-dropdown-link'"
              @click="e => e.preventDefault()"
              >行业应用
            </a>
            <a-menu slot="overlay" class="applicate">
              <a-menu-item class="applicateMenu">
                <div
                  v-for="(item, index) in industryNav"
                  :key="index"
                  class="secondLevel"
                >
                  <div class="item1">{{ item.industryClass }}</div>
                  <div class="item2">
                    <div
                      class="thirdItem"
                      v-for="(level3, key) in item.applications"
                      :key="key"
                      @click="toAppliction(item.industryClass)"
                    >
                      {{ level3 }}
                    </div>
                  </div>
                </div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <!-- 行业应用 end -->

          <!-- 技术文档 -->
          <a-dropdown>
            <span
              @click="linkToApi"
              :class="fileRed == true ? 'antActive' : 'ant-dropdown-link'"
              >技术文档</span
            >
          </a-dropdown>

          <!-- 关于我们 -->
          <a-dropdown>
            <span
              style="margin-right: 0"
              @click="routerLink"
              :class="usRed == true ? 'antActive' : 'ant-dropdown-link'"
              >关于我们</span
            >
          </a-dropdown>
        </a-menu>
      </div>
      <!-- 导航 end -->

      <!-- 用户账号  -->
      <div class="userInfo">
        <div v-if="!showNav" class="showInfo">
          <div @click="homePage" class="bellItem">
            <span class="img1"></span>
            <span class="span1">平台首页</span>
          </div>
          <div class="bellItem" @click="showdrawer" style="display: none">
            <span class="img2"></span>
            <span>消息</span>
            <span class="notice">9</span>
          </div>
        </div>

        <a-dropdown v-model="uservisible">
          <div class="username">
            <span class="littleIcons" v-show="userInfo.username !== null">
              {{ firstWord }}
            </span>
            <span class="accountName">{{ userInfo.username }}</span>
            <a-button
              v-show="userInfo.username == null"
              @click="loginIn"
              class="loginBtn"
              >登录</a-button
            >
          </div>
          <!-- 下拉二级菜单 -->
          <a-menu
            slot="overlay"
            @click="handleMenuClick"
            v-show="userInfo.username !== null"
            :class="userInfo.username == null ? 'unlogin' : userDropDown"
          >
            <a-menu-item>
              <div class="userControl">
                <div v-show="userInfo.username !== null" class="userLogo">
                  <span class="icon">{{ firstWord }}</span>
                  <span class="names" v-show="userInfo.username !== null">{{
                    userInfo.username
                  }}</span>
                </div>
                <div class="self" @click="toUserPage">控制台</div>
                <div class="self" @click="toInfoPage">账号信息</div>

                <div
                  class="self"
                  @click="loginout"
                  v-show="userInfo.username !== null"
                >
                  退出登录
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>

      <!-- 弹窗 -->
      <a-modal
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :closable="false"
        :width="outlogin"
      >
        <div class="outlogin">
          <span class="icon">!</span>
          <span>确定退出登录</span>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import LoginService from "@/service/login";
import DocService from "@/service/doc";
import { cloneDeep } from "lodash";
import axios, { AxiosStatic } from "axios";
import cache from "@/utils/cache";

const docService = DocService.getDocService();

const loginService = LoginService.getLoginService();

@Component
export default class AiNav extends Vue {
  get userInfo() {
    return this.$store.state.user;
  }
  current: any = ["mail"]; // 导航菜单的v-model
  filevisible: boolean = false; // 开发者文档二级菜单隐藏
  uservisible: boolean = false; // 用户的二级菜单隐藏
  homeVisible: boolean = false; // 首页
  homeRed: boolean = false;
  powerRed: boolean = false;
  industryRed: boolean = false;
  usRed: boolean = false;
  fileRed: boolean = false;
  templateRed: boolean = false;
  classifierRed: boolean = false;
  filedTypeRed: boolean = false;
  secondCxt: any = []; // AI能力二级菜单的数据
  firstWord: string = ""; // 名字的第一个字母
  visible: boolean = false;
  confirmLoading: boolean = false;
  // 行业应用
  industryNav: any[] = [];
  // 通过路由控制导航栏的选中状态
  currentname: any = "";
  showNav: boolean = true;
  showOcr: boolean = true;
  isshowdrawer: boolean = false;
  navStyle: string = "content";
  userDropDown: string = "userDropdown";
  outlogin: string = "170px";
  // ocr的入口路径
  ocrEntryPath: string = "";

  created() {
    this.runnableList();
    this.industryNavMenu();
    this.navlistchange();
  }

  @Watch("$route", { deep: true })
  handleChange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.redFocus();
    this.navlistchange();
    this.pathChange();
    if (this.$route.path.startsWith("/main/OCR/")) {
      this.showOcr = true;
    } else {
      this.showOcr = false;
    }
  }

  @Watch("userInfo", { deep: true })
  handleChanges() {
    if (this.$store.state.user.username == null) {
      this.userInfo.username == null;
    }
  }

  mounted() {
    this.userInfo.username = cache.localGet("username");
    // 获取用户名的第一个字母并转为大写
    if (this.userInfo.username) {
      this.firstWord = this.userInfo.username.substr(0, 1).toUpperCase();
    }
    this.redFocus();
    this.pathChange();
  }

  // 导航栏变更时调用
  navlistchange() {
    this.currentname = this.$route.name;
  }

  // 是否显示主导航
  pathChange() {
    if (this.$route.path.startsWith("/main/user/")) {
      this.showNav = false;
      this.navStyle = "userContent";
      this.showOcr = false;
      this.userDropDown = "userDropdownHover";
    } else if (this.$route.path.startsWith("/main/OCR/")) {
      this.showOcr = true;
      this.showNav = false;
      this.navStyle = "userContent";
      this.userDropDown = "userDropdownHover";
    } else {
      this.showNav = true;
      this.showOcr = false;
      this.navStyle = "mainContent";
      this.userDropDown = "userDropdown";
    }
  }
  redFocus() {
    this.homeRed = false;
    this.industryRed = false;
    this.powerRed = false;
    this.fileRed = false;
    this.usRed = false;
    this.templateRed = false;
    this.classifierRed = false;
    this.filedTypeRed = false;
    switch (this.$route.name) {
      case "HomePage":
        this.homeRed = true;
        break;
      case "ApplicationPage":
        this.industryRed = true;
        break;
      case "ApiPower":
        this.powerRed = true;
        break;
      case "insertDoc":
        this.fileRed = true;
        break;
      case "ContactUs":
        this.usRed = true;
        break;
      case "templateList":
        this.templateRed = true;
        break;
      case "templateEdit":
        this.templateRed = true;
        break;
      case "classifierList":
        this.classifierRed = true;
        break;
      case "classifierEdit":
        this.classifierRed = true;
        break;
      case "fieldTypeManagement":
        this.filedTypeRed = true;
        break;
    }
  }

  // 首页跳转
  homePage() {
    this.$router.push("/main/document/HomePage");
  }

  // AI能力二级菜单的传值
  toDetail(id: number, showUrl: any, event: any) {
    const first = id;
    this.$router.push(
      "/main/document/ApiPower/" + `${showUrl}` + "/" + `${id}`
    );
  }

  // AI能力二级菜单接口
  async runnableList() {
    const response = await loginService.getApiNavMenu();
    this.secondCxt = response;
    response.forEach((item: any, key: number) => {
      item.level2.forEach((sec: any, sindex: number) => {
        const a = sec.services.forEach((th: any, thi: number) => {
          if (th.name == "OCR自定义模板识别") {
            this.ocrEntryPath = `/main/document/ApiPower/${th.showUrl}/${th.id}`;
          }
        });
      });
    });
  }

  // 行业应用二级菜单接口
  async industryNavMenu() {
    const response = await loginService.getIndustryNavMenu();
    if (response) {
      this.industryNav = cloneDeep(response);
    }
  }

  // 行业应用跳转
  toAppliction(industryClass: any) {
    this.$router.push({
      path: "/main/document/ApplicationPage/",
      query: {
        industryClass: industryClass
      }
    });
  }

  // 技术文档跳转(有下拉菜单)
  apiPage(index: number, item: any) {
    // this.filevisible = true;
    if (item == "API文档") {
      this.$router.push({
        path: "/main/document/insertDoc/4"
      });
    } else {
      this.$router.push({
        path: "/main/document/insertDoc/" + `${index}`
      });
    }
  }
  // 技术文档跳转(无下拉菜单)
  linkToApi() {
    this.$router.push({
      path: "/main/document/insertDoc/4"
    });
  }

  // 跳到模板管理
  toTemplage() {
    this.$router.push({
      path: "/main/OCR/templateList"
    });
  }
  // 跳到分类器
  toClassifier() {
    this.$router.push({
      path: "/main/OCR/classifierList"
    });
  }
  // 跳到字段管理
  toFieldType() {
    this.$router.push({
      path: "/main/OCR/fieldTypeManagement"
    });
  }

  // 跳到个人中心
  toUserPage() {
    this.uservisible = true;
    this.$router.push("/main/user/system");
    this.showNav = false;
  }

  // 跳到账号信息
  toInfoPage() {
    this.uservisible = true;
    this.$router.push("/main/user/Info");
    this.showNav = false;
  }

  // 账户
  handleMenuClick(e: any) {
    this.homeVisible = false;
    if (e.key === "3") {
      this.filevisible = false;
    }
  }

  // 联系我们
  routerLink() {
    this.$router.push("/main/document/ContactUs");
  }

  // 登录
  loginIn() {
    let queryPath = undefined;
    if (this.$route.query.ocrPage !== undefined) {
      queryPath = this.$route.query.ocrPage;
    } else {
      queryPath = this.$route.fullPath;
    }
    // 先清掉用户信息,再跳转, 携带当前页面的路由
    loginService.logout();
    this.$router.push({
      path: "/login",
      query: {
        prePage: queryPath
      }
    });
  }
  // 退出登录-ok
  handleOk(e: any) {
    this.outlogin = "190px";
    this.confirmLoading = true;
    setTimeout(() => {
      this.visible = false;
      this.confirmLoading = false;
      // 退出登录清除本地 /main/user
      const mainPath = this.$route.path.substring(0, 14);
      const ocrPath = this.$route.path.substring(0, 9);
      const userPath = this.$route.path.substring(0, 10);
      if (mainPath == "/main/document" && ocrPath !== "/main/OCR") {
        this.$router.push({
          path: `${this.$route.fullPath}`
        });
        this.userInfo.username = null;
        this.$store.state.user.username = null;
        this.$message.success("已退出登录");
        return;
      } // ocr页面：退到入口页
      else if (ocrPath == "/main/OCR") {
        this.$router.push({
          path: this.ocrEntryPath,
          query: {
            ocrPage: this.$route.fullPath
          }
        });
        this.userInfo.username = null;
        this.$store.state.user.username = null;
        this.$message.success("已退出登录！");
        return;
      } // 账户页面：退到登录页
      else if (userPath == "/main/user" && ocrPath !== "/main/OCR") {
        this.$router.push({
          path: "/login",
          query: {
            prePage: this.$route.fullPath
          }
        });
        this.userInfo.username = null;
        this.$store.state.user.username = null;
        this.$message.success("已退出登录");
      }
      cache.localClear();
    }, 1000);
  }

  handleCancel(e: any) {
    this.visible = false;
  }

  // 退出登录
  loginout() {
    this.visible = true;
  }

  showdrawer() {
    this.isshowdrawer = !this.isshowdrawer;
    this.$store.commit("changeshowDrawer", this.isshowdrawer);
  }
}
</script>

<style lang="scss" scoped>
@import "./Nav.scss";
/deep/.ant-modal-footer {
  border-top: none;
  div {
    display: flex;
  }
}
/deep/.ant-modal-body {
  padding-bottom: 0;
}
.outlogin {
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    border-radius: 50%;
    background: rgba(254, 154, 53, 1);
    color: #fff;
    margin-right: 5px;
  }
}
</style>
