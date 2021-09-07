<template>
  <div class="homePage">
    <!-- 轮播图 autoplay 每4s切换，自动播放-->
    <div class="swiperWrap">
      <a-carousel
        :autoplay="autoplay"
        :arrows="arrow"
        :autoplaySpeed="autoplaySpeed"
        ref="carousel"
      >
        <div
          v-for="(item, index) in swiperList"
          :key="index"
          class="swiperItem"
          @click="linkTo(item)"
        >
          <img :src="item.path" alt="" />
        </div>
      </a-carousel>
    </div>
    <!--核心能力 arrowR.png => 备注： 默认状态是，没有向左箭头交互，当用户在点击向右箭头切换查看更多算法能力之后，才出现-->
    <div class="core">
      <div class="title"><span class="line"></span>核心能力</div>
      <p class="lineP">
        提供从感知到认知的人工智能技术方案，助力行业从信息化到人工智能化的升级换挡
      </p>
      <a-tabs default-active-key="2" type="card" class="tabWrap">
        <a-tab-pane
          v-for="(item, index) in coreList"
          :key="index"
          v-show="item.services[0].name !== undefined"
        >
          <span slot="tab">
            <img
              v-if="svgName.includes(item.serviceGroup)"
              :src="require(`@/assets/images/newicon/${item.serviceGroup}.svg`)"
              alt=""
              class="tabImg"
            />
            <span class="tabName">{{ item.serviceGroup }}</span>
          </span>
          <div class="tabContent">
            <img
              :src="require('@/assets/images/v2/arrowL.png')"
              alt=""
              class="btn-l"
              v-show="item.services.length < 3 ? false : cardItemshow !== 1"
              @click="LchangeCard"
            />
            <div
              v-for="(s, key) in item.services"
              :key="key"
              class="cardItem"
              @click="toApiPower(s)"
              v-show="
                item.services.length < 3
                  ? true
                  : Math.ceil((key + 1) / 3) == cardItemshow
              "
            >
              <div class="names">{{ s.name }}</div>
              <div class="tabDesc">
                {{ s.desc }}
              </div>
            </div>
            <img
              :src="require('@/assets/images/v2/arrowR.png')"
              alt=""
              class="btn-r"
              v-show="item.services.length / 3 > cardItemshow"
              @click="RchangeCard(item.services.length)"
            />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 行业应用-->
    <div class="application" v-if="industryShow == true">
      <div class="title"><span class="line"></span>行业应用</div>
      <div class="gray">
        新一代强认知AI平台及认知驱动的人机交互与协同技术赋能行业应用
      </div>
      <div class="cardControl">
        <div class="cardItem" v-for="item in scenaries" :key="item.id">
          <div class="bgItem">
            <!-- <img :src="item.banner" alt="" /> -->
            <!-- 暂时写死，不从后台获取 -->
            <img
              src="@/assets/images/v2/homePageIndustry1.png"
              v-if="item.name == '英语作文批改'"
            />
            <img
              src="@/assets/images/v2/homePageIndustry2.png"
              v-if="item.name == '指尖检测'"
            />
            <img
              src="@/assets/images/v2/homePageIndustry3.png"
              v-if="item.name == '书法评测'"
            />
          </div>
          <div class="txtBox">
            <div class="txtControl">
              <div class="whiteName">{{ item.name }}</div>
              <div class="animate">
                <div class="whiteDesc">{{ item.desc }}</div>
                <div class="redDetail" @click="toIndustryDetail(item.name)">
                  查看详情
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <scenary-card :scenary="scenaries"></scenary-card> -->
    </div>

    <!-- 以强认知AI平台，提升人类福祉 -->
    <div class="companyBg">
      <div class="centerWrap">
        <div class="rightBg">
          <img
            :src="require(`@/assets/images/v2/home_bg0${currentkey}.jpg`)"
            alt=""
          />
        </div>

        <div class="leftWrap">
          <span class="line"></span
          ><span class="bolds">以强认知AI平台，提升人类福祉</span>
          <div class="line2">
            DMAI在国际上率先提出人工智能的五层认知架构，通过开创性的
            “小数据、大任务”技术范式，攻克人工智能“常识获取”的难题，并向通用人工智能迈进。
          </div>
          <a-tabs default-active-key="1" @change="changekey">
            <a-tab-pane key="1">
              <span slot="tab" class="tabCaption">技术优势</span>
              <div class="tabBox">
                <div class="tabItems">
                  <img src="@/assets/images/v2/jingdu.svg" alt="" />
                  <div class="theme">高精度</div>
                  <div class="describe">
                    <div>情感分类精确度高达99.3%</div>
                    <div>物体分类精确度高达95.4%</div>
                    <div>三维人体关键点估计准确率全球第一</div>
                  </div>
                </div>
                <div class="tabItems">
                  <img src="@/assets/images/v2/fast.svg" alt="" />
                  <div class="theme">高速度</div>
                  <div class="describe">
                    <div>处于行业领先</div>
                    <div>毫秒级完成识别</div>
                    <div>且支持大规模实时检测与识别</div>
                  </div>
                </div>
                <div class="tabItems">
                  <img src="@/assets/images/v2/TOP1.svg" alt="" />
                  <div class="theme">TOP 1</div>
                  <div class="describe">
                    <div>10项全球第一的研发成果</div>
                    <div>11项人工智能领域重量级国际奖项</div>
                    <div>4项国际首创及6项自主研发成果</div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab" class="tabCaption">核心团队</span>
              <div class="tabGroup">
                <div class="leftImg">
                  <img src="@/assets/images/v2/home_group.png" alt="" />
                </div>
                <div class="rightText">
                  <p class="rBolds">
                    在中国、美国分别设立有研发机构，且与多所知名高校建立合作研发
                  </p>
                  <div class="rGrays">
                    <div>
                      ·85%以上研究成员拥有硕士及以上学历，11%为博士学历
                    </div>
                    <div>
                      · 汇聚UCLA、CMU、英国剑桥大学、伦敦大学等顶级名校的科学家
                    </div>
                    <div>· 来自谷歌、微软等世界五百强科技企业的资深工程师</div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3">
              <span slot="tab" class="tabCaption">知识产权</span>
              <div class="tabProperty">
                <div class="topText">
                  以强认知AI关键核心技术为主攻方向，首创认知交流计算架构。
                </div>
                <div class="tabControl">
                  <div class="tabPanel">
                    <div class="tabLine1">
                      <img
                        src="@/assets/images/newicon/认知推理能力.svg"
                        alt=""
                      />
                    </div>
                    <div class="tabLine2 single">全球首个</div>
                    <div class="tabTheme">具认知推理能力</div>
                    <div class="tabLine2">AI技术平台</div>
                  </div>
                  <div
                    class="tabPanel"
                    v-for="(item, index) in tabProperty"
                    :key="index"
                  >
                    <div class="tabLine1"><img :src="item.img" alt="" /></div>
                    <div class="tabTheme">{{ item.theme }}</div>
                    <div class="tabLine2">{{ item.content }}</div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>

    <!-- 合作伙伴 -->
    <div class="partners">
      <div class="title"><span class="line"></span>合作伙伴</div>
      <div class="partner">
        <img
          src="@/assets/images/v2/logo_home@2x.png"
          width="100%"
          height="100%"
          alt=""
        />
      </div>
    </div>

    <!-- 公司理念 -->
    <div class="companyValues">
      <div class="companyBrief">
        <div @click="routerLink">
          <img src="@/assets/images/v2/companoder.svg" alt="" />
          <div class="text">公司理念</div>
        </div>
      </div>
      <div class="companyBrief">
        <div @click="routerLink">
          <img src="@/assets/images/v2/compnnews.svg" alt="" />
          <div class="text">公司简介</div>
        </div>
      </div>
      <div class="companyBrief" @click="routerLink">
        <div>
          <img src="@/assets/images/v2/callme.svg" alt="" />
          <div class="text">联系我们</div>
        </div>
      </div>
    </div>

    <!-- 认知未来 -->
    <div class="miRai">
      <div class="word">让AI认知未来</div>
      <a-button @click="showModal">合作咨询</a-button>
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
import { Component, Prop, Vue } from "vue-property-decorator";
import cache from "@/utils/cache";
import { cloneDeep } from "lodash";
import ScenaryCard from "./components/Scenary.vue"; // 应用场景
import AConsult from "./components/Consult.vue";
import LoginService from "@/service/login";
import { fileItemName } from "@/utils/publicJsEvent";
const loginService = LoginService.getLoginService();

@Component({
  components: {
    ScenaryCard,
    AConsult
  }
})
export default class HomePage extends Vue {
  swiperList: any[] = [];
  arrow: boolean = false;
  autoplay: boolean = true;
  autoplaySpeed: number = 5000;
  coreList: any[] = [];
  scenaries: any[] = [];
  tabProperty: any[] = [
    {
      img: require("@/assets/images/newicon/软件制作权.svg"),
      theme: "20项",
      content: "软件著作权"
    },
    {
      img: require("@/assets/images/newicon/商标保护.svg"),
      theme: "10项",
      content: "商标保护"
    },
    {
      img: require("@/assets/images/newicon/专利.svg"),
      theme: "30项",
      content: "专利进入实审阶段"
    }
  ];
  consultVisible: boolean = false;
  appearModal: boolean = false;
  lastItem: any[] = [];
  industryShow: boolean = false;
  cardItemshow: number = 1;
  svgName: any[] = [];
  currentkey: number = 1;

  created() {
    this.getHomeBanner();
    this.getHomeIndustry();
    this.getHomeService();
  }

  mounted() {
    this.svgName = fileItemName();
  }

  // 右侧按钮切换
  RchangeCard(val: any) {
    this.cardItemshow++;
  }

  // 左侧按钮切换
  LchangeCard(val: any) {
    if (this.cardItemshow == 1) return;
    this.cardItemshow--;
  }

  // 跳转到对应的AI详情页
  toPageDetail(name: string) {
    this.lastItem = [];
    const nav: any = [];
    const datas: any = cloneDeep(cache.localGet("navData"));
    for (let x in datas) {
      for (let y in datas[x].level2) {
        nav.push(datas[x].level2[y]);
      }
    }
    nav.forEach((item: any, key: number) => {
      item.services.forEach((i: any, ak: number) => {
        this.lastItem.push(i);
      });
    });
    this.lastItem.forEach((item: any, k: number) => {
      if (name == item.name) {
        this.$router.push(`/main/document/ApiPower/${item.showUrl}/${item.id}`);
      }
    });
  }

  // 轮播图跳转
  linkTo(item: any) {
    // 跳到行业详情页
    if (item.linkedType == "行业分类") {
      this.$router.push({
        path: "/main/document/ApplicationPage/",
        query: {
          name: item.linkedContent
        }
      });
    } else if (item.linkedType == "AI能力") {
      this.toPageDetail(item.linkedContent);
    } else {
      window.open(item.linkedContent);
    }
  }
  // banner接口
  async getHomeBanner() {
    const response = await loginService.getHomeBanner();
    if (response) {
      this.swiperList = cloneDeep(response);
    }
  }
  // 行业推荐接口
  async getHomeIndustry() {
    const response = await loginService.getHomeIndustry();
    if (response) {
      this.scenaries = cloneDeep(response);
      this.industryShow = true;
      let a: any = [];
      response.forEach((item: any, key: number) => {
        const objects = {
          theme: item.name,
          content: item.desc
        };
        a.push(objects);
      });
    }
  }
  // 核心能力接口
  async getHomeService() {
    const response = await loginService.getHomeService();
    if (response) {
      this.coreList = cloneDeep(response);
    }
  }
  // 行业应用
  toIndustryDetail(name: any) {
    this.$router.push({
      path: "/main/document/ApplicationPage/",
      query: {
        name: name
      }
    });
  }

  // 联系我们
  routerLink() {
    this.$router.push("/main/document/ContactUs");
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
    this.$router.push("ApiPower/" + val.showUrl + "/" + val.id);
  }
  // 改变行业应用优势banner图片切换
  changekey(key: number) {
    this.currentkey = key;
  }
}
</script>
<style lang="scss" scoped>
@import "./css/HomePage.scss";
</style>
