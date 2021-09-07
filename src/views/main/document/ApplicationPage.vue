<template>
  <div class="ApplicatePage">
    <!-- 头图 -->
    <div class="bannerBg">
      <div class="bannerBox">
        <div class="rightWrap">
          <img :src="banner" alt="头图" />
        </div>
        <div class="leftWrap">
          <div class="size">
            <b>{{ industryClass }}</b>
          </div>
          <div class="desc">{{ desc }}</div>
        </div>
      </div>
    </div>
    <!-- 合作咨询 -->
    <div class="consultDiv">
      <div class="consultBtn">
        <a-button @click="showModal">合作咨询</a-button>
      </div>
    </div>
    <!-- 内容 -->
    <div class="thesis" v-if="applications.length !== 0">
      <a-tabs
        :default-active-key="0"
        :class="applications.length !== 1 ? 'tabStyle' : 'noTabNav'"
      >
        <a-tab-pane v-for="(item, index) in applications" :key="index">
          <span slot="tab" v-if="applications.length !== 1">{{
            item.name
          }}</span>
          <div class="tabPane">
            <div class="versions">
              <div class="controlBox" v-if="item.applications !== undefined">
                <!-- 左边图片 -->
                <div class="versionWrap">
                  <img :src="item.banner" alt="" />
                </div>
                <!-- 右边apk下载 -->
                <div class="rightDesc">
                  <div class="div1">
                    <b>{{ item.name }}</b>
                  </div>
                  <div class="div2">{{ item.desc }}</div>
                  <!-- 手机版、平板版 target="_blank"-->
                  <div class="div3">
                    <div v-for="(v, indexV) in item.applications" :key="indexV">
                      <a-button
                        v-if="item.applications[indexV].path !== 'delete'"
                        @click="versionBtn(indexV)"
                      >
                        <a :href="item.applications[version1].path">{{
                          v.type
                        }}</a>
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 高精度 -->
            <div class="panelControl">
              <div
                class="panel"
                v-for="(d, indexD) in item.descriptions"
                :key="indexD"
              >
                <div class="panelImg">
                  <img src="@/assets/images/v2/home_ad.png" alt="icon" />
                </div>
                <div class="panelTheme">
                  <b>{{ d.theme }}</b>
                </div>
                <div class="panelDesc">{{ d.content }}</div>
              </div>
            </div>
            <!-- 使用功能 rtl ltr -->
            <div
              :class="['record', (indexF + 1) % 2 == 0 ? 'reverse' : '']"
              v-for="(f, indexF) in item.functions"
              :key="indexF"
            >
              <div class="shadow">
                <img :src="f.path" alt="" />
              </div>
              <div class="introduce">
                <div class="bgImg">
                  <!-- ui添加图片 -->
                  <img :src="numberImg[indexF]" alt="" />
                </div>
                <div class="introduceTheme">{{ f.theme }}</div>
                <div class="introduceContent">
                  {{ f.content }}
                </div>
              </div>
            </div>
            <!-- 关联能力 -->
            <div class="relation" v-if="item.recommends.length !== 0">
              <div class="relationText">
                <img :src="apiIcon" alt="" />
                产品所集成的AI服务
              </div>
              <div class="relationWrap">
                <div
                  class="relationPanel"
                  v-for="(r, indexR) in item.recommends"
                  :key="indexR"
                  @click="toApiPower(r)"
                >
                  <div class="Rtheme">{{ r.name }}</div>
                  <div class="Rcontent">
                    {{ r.desc }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 应用特性 -->
            <div class="character" v-if="item.advantages.length !== 0">
              <div class="characterWrap">
                <div class="characterTitle">
                  <span class="redLine"></span>
                  <b>应用特性</b>
                </div>
                <div class="characterList">
                  <div
                    class="characterItem"
                    v-for="(a, indexA) in item.advantages"
                    :key="indexA"
                  >
                    <div class="cImg">
                      <img :src="characterList[indexA]" alt="" />
                    </div>
                    <div class="cTheme">{{ a.theme }}</div>
                    <div class="cContent">{{ a.content }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div v-else class="thesis">
      <div class="noContent">无内容</div>
    </div>

    <!-- 合作咨询弹窗 -->
    <a-consult
      :appearModal="appearModal"
      v-if="consultVisible"
      @controlModal="controlModal($event)"
    ></a-consult>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import LoginService from "@/service/login";
import AConsult from "./components/Consult.vue"; // 合作咨询
import UserService from "@/service/user";
import { cloneDeep } from "lodash";
const userService = UserService.getUserService();

const loginService = LoginService.getLoginService();

@Component({
  components: { AConsult }
})
export default class ApplicationPage extends Vue {
  banner: string = "";
  desc: string = "";
  industryClass: string = "";
  industryId: any;
  applications: any[] = [];
  version1: number = 0;

  apiIcon: string = require("@/assets/images/v2/API.png");
  characterList: any[] = [
    require("@/assets/images/newicon/领先技术.svg"),
    require("@/assets/images/newicon/全周期覆盖.svg"),
    require("@/assets/images/newicon/多功能.svg")
  ];
  // 使用功能数字图片
  numberImg: any[] = [
    require("@/assets/ApplicationPageImg/1.png"),
    require("@/assets/ApplicationPageImg/2.png"),
    require("@/assets/ApplicationPageImg/3.png"),
    require("@/assets/ApplicationPageImg/4.png")
  ];

  consultVisible: boolean = false;
  appearModal: boolean = false;
  routeName: string = "";
  routeIndustryClass: string = "";

  created() {
    this.routeName = this.$route.query.name as string;
    this.routeIndustryClass = this.$route.query.industryClass as string;
    if (this.routeName !== undefined) {
      this.getIndustryDetail(this.routeName);
    } else if (this.routeIndustryClass !== undefined) {
      this.getApplicationDetail(this.routeIndustryClass);
    } else {
      this.routeName = "";
      this.routeIndustryClass = "";
    }
  }

  mounted() {
    console.log("行业应用页面", this.$route.fullPath);
  }

  @Watch("$route.query", { deep: true })
  handleRouteChange2() {
    const industryClass = this.$route.query.industryClass as string;
    this.getApplicationDetail(industryClass);
  }

  async getApplicationDetail(name: string) {
    const response = await loginService.getApplicationDetail(name);
    if (response) {
      const { banner, desc, industryClass, applications } = response;
      this.applications = cloneDeep(response.applications);
      this.banner = banner;
      this.desc = desc;
      this.industryClass = industryClass;
      if (this.applications.length !== 0) {
        this.industryId = this.applications[0].id;
      }
    }
  }
  // 由首页跳进来调用的接口
  async getIndustryDetail(name: string) {
    const response = await loginService.getIndustryDetail(name);
    if (response) {
      const { banner, desc, industryClass, applications } = response;
      this.banner = banner;
      this.desc = desc;
      this.industryClass = industryClass;
      this.applications = cloneDeep(applications);
    }
  }
  // 合作咨询
  showModal() {
    this.consultVisible = true;
    this.appearModal = true;
  }
  // 下载
  versionBtn(index: number) {
    this.version1 = index;
    this.getIndustryDownload(this.industryId);
  }
  // 下载次数
  async getIndustryDownload(id: number) {
    const response = await userService.getIndustryDownload(id);
    this.$message.success(response);
  }
  // 取消合作咨询弹窗
  controlModal(fade: boolean) {
    this.consultVisible = fade;
  }
  // 点击跳转至AI能力
  toApiPower(val: any) {
    this.$router.push({
      name: "ApiPower",
      params: {
        type: val.showUrl,
        id: val.id
      }
    });
  }
}
</script>
<style lang="scss" scoped>
@import "./css/pageSame.scss";
@import "./css/ApplicationPage.scss";
</style>
