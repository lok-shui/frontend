<template>
  <div class="controll">
    <a-spin :spinning="pageloading" tip="页面载入中...">
      <div class="bannerWrap">
        <banner-wrap
          v-if="bannerUrl !== ''"
          :bannerName="bannerName"
          :website="website"
          :showUrl="showUrl"
          :desc="bannerDesc"
          :apiId="apiId"
          :bannerUrl="bannerUrl"
          :showdialogue="showdialogue"
          :alias="alias"
        ></banner-wrap>
      </div>
      <!-- 功能描述 -->
      <div class="descriptions" v-if="JSON.stringify(descriptions) !== '[]'">
        <div
          :class="[
            'descItem',
            descriptions.length <= 2 ? 'descItemmax' : 'descItemmin'
          ]"
          v-for="(item, index) in descriptions"
          :key="index"
        >
          <div class="imgShadow">
            <img
              v-if="svgName.includes(item.theme)"
              :src="require(`@/assets/images/newicon/${item.theme}.svg`)"
              alt=""
            />
            <img v-else src="@/assets/images/newicon/稳定可靠.svg" alt="" />
          </div>
          <div class="desc">
            <div class="theme">{{ item.theme }}</div>
            <div class="content">{{ item.content }}</div>
          </div>
        </div>
      </div>
      <!-- 功能详情 -->
      <div v-if="JSON.stringify(functions) !== '[]'">
        <div
          v-for="(item, index) in functions"
          :class="['record', (index + 1) % 2 == 0 ? 'reverse' : '']"
          :key="index"
        >
          <div class="shadow">
            <img :src="item.path" alt="" />
          </div>
          <div class="introduce">
            <div class="bgImg">
              <img :src="numberImg[index]" alt="" />
            </div>
            <div class="introduceTheme">{{ item.theme }}</div>
            <div class="introduceContent">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>

      <div class="mainContain">
        <!-- OCR文字识别 -->
        <div
          class="trial"
          v-if="showUrl == 'OCR' && JSON.stringify(scenaries) !== '[]'"
        >
          <div class="title">
            <span class="line"></span><span>使用体验</span>
          </div>
          <img-identify :identifyList="identifyList"></img-identify>
        </div>
        <!-- 人脸 -->
        <div
          class="trial"
          v-if="showUrl == 'facePage' && JSON.stringify(facePage) !== '[]'"
        >
          <div class="title">
            <span class="line"></span><span>使用体验</span>
          </div>
          <face-landmark :facePage="facePage" />
          <p class="tip">
            图片要求：JPG(JPEG)，图片大小不超过2M，人脸最小150*150像素。
          </p>
        </div>
        <!-- 语速计算 -->
        <div
          class="trial"
          v-if="showUrl == 'AudioPlay' && JSON.stringify(speechList) !== '[]'"
        >
          <div class="title">
            <span class="line"></span><span>使用体验</span>
          </div>
          <audio-play :audioData="speechList"></audio-play>
        </div>
        <!-- 语音合成 -->
        <div
          class="trial"
          v-if="showUrl == 'Speech' && JSON.stringify(speechVoice) !== '[]'"
        >
          <div class="title">
            <span class="line"></span><span>使用体验</span>
          </div>
          <synthetic-speech :speech="speechVoice"></synthetic-speech>
        </div>
        <!-- 人体姿态估计 -->
        <div
          class="trial"
          v-if="
            showUrl == 'BodyPosture' && JSON.stringify(bodyPosture) !== '[]'
          "
        >
          <div class="title" v-if="showVideo !== '' && showVideo !== 'delete'">
            <span class="line"></span><span>演示视频</span>
          </div>
          <body-posture
            :bodyPosture="bodyPosture"
            :showVideo="showVideo"
          ></body-posture>
        </div>

        <!-- 应用场景 -->
        <div class="aiScenarios" v-if="JSON.stringify(scenaries) !== '[]'">
          <div class="title">
            <span class="line"></span><span>应用场景</span>
          </div>
          <scenary-card :scenary="scenaries"></scenary-card>
        </div>

        <!-- 优势 -->
        <div class="advantagesBg" v-if="advantagesShow">
          <div class="advantages">
            <div class="title"><span class="line"></span><span>优势</span></div>
            <div class="itemBox">
              <div
                class="internal"
                v-for="(item, index) in advantages"
                :key="index"
              >
                <div class="imgDashed">
                  <img
                    v-if="svgName.includes(item.theme)"
                    :src="require(`@/assets/images/newicon/${item.theme}.svg`)"
                    alt=""
                  />
                  <img
                    v-else
                    src="@/assets/images/newicon/领先的算法.svg"
                    alt=""
                  />
                </div>
                <p class="p1">{{ item.theme }}</p>
                <p class="p2">{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 接入方式  -->
        <div
          class="accessMethods"
          v-if="JSON.stringify(accessMethods) !== '[]'"
        >
          <div class="title">
            <span class="line"></span><span>接入方式</span>
          </div>
          <div class="methodBox">
            <div
              :class="[accessMethods[0] !== '' ? 'itemCard' : '', 'flexStyle']"
              v-for="(item, index) in accessMethods"
              v-show="accessMethods[0] !== undefined"
              :key="index"
            >
              <div v-for="(m, k) in methodText" :key="k">
                <div v-if="item == m.theme">
                  <div class="methodTheme">
                    <img :src="methodText[k].icon" alt="icon" />
                    <span>{{ methodText[k].theme }}</span>
                  </div>
                  <div class="methodDesc">{{ methodText[k].desc }}</div>
                  <div v-if="m.theme == 'API'" class="redText">
                    <span @click="linkToAPI" v-if="apiId !== -1">API文档</span>
                  </div>
                  <div v-else class="redText">
                    <span @click="showModal">申请试用</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 相关推荐 -->
        <div class="recommends" v-if="recommends.length !== 0">
          <div class="title">
            <span class="line"></span><span>相关推荐</span>
          </div>
          <div class="recommendList">
            <div
              class="panel"
              v-for="(item, index) in recommends"
              :key="index"
              @click="toApiPower(item)"
            >
              <div class="img">
                <img
                  v-if="item.name == '人脸框+人脸关键点'"
                  src="@/assets/images/v2/FacePage1.png"
                  alt=""
                />
                <img
                  v-if="item.name == '人脸朝向'"
                  src="@/assets/images/v2/FacePage2.png"
                  alt=""
                />
                <img
                  v-if="item.name == '人体姿态估计'"
                  src="@/assets/images/v2/BodyPosture.png"
                  alt=""
                />
                <img
                  v-if="item.name == '文字识别'"
                  src="@/assets/images/v2/OCR.png"
                  alt=""
                />
                <img
                  v-if="item.name == '语音合成'"
                  src="@/assets/images/v2/Speech.png"
                  alt=""
                />
                <img
                  v-if="item.name == '语速计算'"
                  src="@/assets/images/v2/AudioPlay.png"
                  alt=""
                />
                <img
                  v-if="item.name == '对话流平台'"
                  src="@/assets/images/v2/hidden1.png"
                  alt=""
                />
                <img
                  v-if="item.name == 'OCR自定义模板识别'"
                  src="@/assets/images/v2/hidden2.png"
                  alt=""
                />
              </div>

              <div class="panelTitle">{{ item.name }}</div>
              <div class="panelDesc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
        <!-- 让AI认知未来 -->
        <div class="miRai">
          <div class="word">让AI认知未来</div>
          <a-button @click="showModal">合作咨询</a-button>
        </div>
      </div>
    </a-spin>
    <!-- 合作咨询弹窗 -->
    <a-consult
      :appearModal="appearModal"
      v-if="consultVisible"
      @controlModal="controlModal($event)"
    ></a-consult>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import document from "./data";
import BannerWrap from "./components/Banner.vue"; // 头图组件
import IdentifyMath from "./components/OCR.vue"; // 数学公式
import FaceLandmark from "./components/FaceLandmark.vue"; // 人脸关键点组件

import SyntheticSpeech from "./components/SyntheticSpeech.vue"; // 语音合成组件
import AudioPlay from "./components/AudioPlay.vue"; // 音频组件
import ImgIdentify from "./components/OCR.vue"; // 文字识别组件
import BodyPosture from "./components/BodyPosture.vue"; // 人体姿态估计组件
import AConsult from "./components/Consult.vue"; // 合作咨询组件

import ScenaryCard from "./components/Scenary.vue"; // 应用场景
import DocService from "@/service/doc";
import axios, { AxiosStatic } from "axios";
import { fileItemName } from "@/utils/publicJsEvent";

import { cloneDeep } from "lodash";
import UserService from "@/service/user";
import cache from "@/utils/cache";
const userPurchase = UserService.getUserService();
const userService = DocService.getDocService();
@Component({
  components: {
    BannerWrap,
    IdentifyMath,
    FaceLandmark,
    SyntheticSpeech,
    AudioPlay,
    ScenaryCard,
    ImgIdentify,
    BodyPosture,
    AConsult
  }
})
export default class InsertDoc extends Vue {
  get docId() {
    return this.$route.params.id;
  }

  get doc() {
    const id = +this.docId;
    return document[id] || null;
  }
  pageloading: boolean = false;
  bannerName: string = ""; // banner图片
  website: string = "";
  bannerUrl: string = ""; // banner路径
  showUrl: string = ""; // 分类
  bannerDesc: string = ""; // banner描述
  descriptions: any[] = []; // 功能描述
  functions: any[] = []; // 功能详情
  // 使用功能: 数字图片
  numberImg: any[] = [
    require("@/assets/ApplicationPageImg/1.png"),
    require("@/assets/ApplicationPageImg/2.png"),
    require("@/assets/ApplicationPageImg/3.png"),
    require("@/assets/ApplicationPageImg/4.png")
  ];
  recommends: any[] = [];
  advantages: any[] = []; // 优势
  advantagesShow: boolean = false;
  accessMethods: any[] = []; // 接入方式
  methodText: any[] = [
    {
      theme: "API",
      icon: require("@/assets/images/v2/API.png"),
      desc: "通过API调用，快速灵活接入AI开放平台的算法服务"
    },
    {
      theme: "SDK",
      icon: require("@/assets/images/v2/SDK.png"),
      desc: "集成SDK到您的应用中，接入各种离线功能的实时算法"
    },
    {
      theme: "私有化部署",
      icon: require("@/assets/images/v2/privatization_deployment.png"),
      desc:
        "部署至本地服务器或专有云服务器，根据需求为你定制完整的软硬件解决方案"
    }
  ];
  apiId: number = -1;
  scenaries: any = [];
  identifyList: any = []; // 文字识别
  bodyPosture: any = []; // 人体姿态估计
  showVideo: string = ""; // 人体姿态视频
  speechList: any = []; // 语速计算
  speechVoice: any = []; // 语音合成;
  facePage: any[] = [];
  consultVisible: boolean = false; // 合作咨询
  appearModal: boolean = false;
  svgName: any[] = [];
  alias: string = "";
  showdialogue: boolean = false;

  created() {
    const id = Number(this.$route.params.id);
    const showUrl = this.$route.params.type;
    this.secondUrl(id, showUrl);
    const useId = cache.localGet("ai-front-id");
    if (useId !== null) {
      this.isPurchase(useId);
    }
  }

  // 监听路由的变化，根据路由的id来调不同的接口
  @Watch("$route.params.id", { deep: true })
  handleRouteChange() {
    setTimeout(() => {
      const id = Number(this.$route.params.id);
      const showUrl = this.$route.params.type;
      this.descriptions = [];
      this.functions = [];
      this.scenaries = [];
      this.advantages = [];
      this.advantagesShow = false;
      this.accessMethods = [];
      this.recommends = [];
      this.secondUrl(id, showUrl);
    });
  }

  mounted() {
    this.svgName = fileItemName();
  }

  linkToAPI() {
    if (this.apiId == -1) {
      this.$message.error("需要尽快配置");
      return;
    } else {
      this.$router.push({
        path: "/main/document/insertDoc/4",
        query: {
          apiId: String(this.apiId)
        }
      });
    }
  }

  // 人脸关键点 人脸朝向 ： facePage
  // 人体姿态估计：BodyPosture
  // 语速计算：AudioPlay
  // 语音合成：Speech
  // ocr文字识别: OCR

  secondUrl(id: number, showUrl: string) {
    // this.pageloading = true;
    this.facePage = [];
    axios({
      method: "get",
      url: `/v1/service-manager/service/detail/${id}`,
      timeout: 1000 * 60
    })
      .then((res: any) => {
        this.pageloading = false;
        if (res.data.error) {
          this.$message.error(res.data.error);
        }
        if (res.data.code == 0) {
          const {
            banner,
            desc,
            name,
            showUrl,
            accessMethods,
            advantages,
            descriptions,
            interfaceList,
            recommends,
            functions,
            scenes,
            showVideo,
            website,
            alias
          } = res.data.data;
          this.alias = alias;
          // banner：
          this.bannerDesc = desc;
          this.bannerName = name;
          this.bannerUrl = banner;
          this.website = website;
          // 功能描述
          if (descriptions && JSON.stringify(descriptions) !== "[]") {
            this.descriptions = cloneDeep(descriptions);
          }
          // 功能详情
          if (functions && JSON.stringify(functions) !== "[]") {
            this.functions = cloneDeep(functions);
          }
          // 体验：
          if (interfaceList.length !== 0) {
            this.apiId = interfaceList[0].interfaceId;
            this.showUrl = showUrl;
            const classify = showUrl;
            const photosLength = interfaceList[0].photos.length;
            if (photosLength !== 0) {
              switch (classify) {
                case "OCR":
                  this.identifyList = cloneDeep(interfaceList);
                  break;
                case "facePage":
                  this.facePage = cloneDeep(interfaceList);
                  break;
                case "BodyPosture":
                  this.bodyPosture = cloneDeep(interfaceList);
                  this.showVideo = showVideo;
                  break;
                case "Speech":
                  this.speechVoice = cloneDeep(interfaceList);
                  break;
                case "AudioPlay":
                  this.speechList = cloneDeep(interfaceList);
                  break;
              }
            }
          }

          // 应用场景
          if (scenes && JSON.stringify(scenes) !== "[]") {
            this.scenaries = cloneDeep(scenes);
          } else {
            this.scenaries = [];
          }
          // 优势
          if (accessMethods && JSON.stringify(advantages) !== "[]") {
            this.advantagesShow = true;
            this.advantages = cloneDeep(advantages);
          }
          // 接入方式
          if (accessMethods && JSON.stringify(accessMethods) !== "[]") {
            this.accessMethods = cloneDeep(accessMethods);
          }
          //  相关推荐
          if (recommends && JSON.stringify(recommends) !== "[]") {
            this.recommends = cloneDeep(recommends);
          }
        }
      })
      .catch(error => {
        this.pageloading = false;
        this.$message.error(error);
        console.log(error);
      });
  }

  // 合作咨询
  showModal() {
    this.consultVisible = true;
    this.appearModal = true;
  }
  controlModal(fade: boolean) {
    this.consultVisible = fade;
  }

  // 核心能力点击跳转至AI能力
  toApiPower(val: any) {
    const currentId = this.$route.params.id;
    // 如果是跳转至当前页则返回顶部，否则跳转至新的页面
    if (currentId == val.id) {
      // document.body.scrollTop = 0;
      // document.documentElement.scrollTop = 0;
      this.$message.info("您已在当前页面");
    } else {
      this.$router.push({
        name: "ApiPower",
        params: {
          type: val.showUrl,
          id: val.id
        }
      });
    }
  }
  // 是否开通ai能力
  async isPurchase(useId: any) {
    const data = {
      userId: useId,
      serviceName: "dialogue"
    };
    const res = await userPurchase.isPurchase(data);
    this.showdialogue = res;
  }
}
</script>

<style lang="scss" scoped>
@import "./css/ApiPower.scss";
@import "./css/pageSame.scss";
</style>
