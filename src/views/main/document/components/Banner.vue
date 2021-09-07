<template>
  <div>
    <div class="bg">
      <div class="bgImg">
        <img :src="bannerUrl" alt="" />
      </div>

      <div class="humanFace">
        <div class="face">{{ bannerName }}</div>
        <div class="message">
          {{ desc }}
        </div>
        <a-button v-if="showOcr" class="cooperate" @click="toOcrPage">
          立即体验
        </a-button>
        <a-button
          class="cooperate"
          @click="showModal"
          v-show="alias !== 'dialogue' ? true : showdialogue ? false : true"
        >
          合作咨询
        </a-button>
        <a-button
          class="cooperate"
          @click="toWebsite"
          v-show="alias == 'dialogue' && showdialogue ? true : false"
          style="padding: 0 20px"
        >
          <a :href="websiteUrl">进入平台</a>
        </a-button>
        <a class="api" @click="linkToAPI" v-if="apiId !== -1">API文档</a>
      </div>
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import pageEvent from "@/utils/event";
import axios, { AxiosStatic } from "axios";
import AConsult from "./Consult.vue";
import cache from "@/utils/cache";
@Component({
  components: { AConsult }
})
export default class Banner extends Vue {
  @Prop({}) bannerName!: any;
  @Prop({}) bannerUrl!: string;
  @Prop({}) website!: string;
  @Prop({}) desc!: any;
  @Prop({}) apiId!: any;
  @Prop({}) showdialogue!: any;
  @Prop({}) alias!: any;
  types: string = "";
  rid: string = "";
  consultVisible: boolean = false;
  appearModal: boolean = false;
  showOcr: boolean = false;
  websiteUrl: string = "";

  @Watch("rid", { deep: true })
  handleChange() {
    this.types = this.$route.params.type;
    this.rid = this.$route.params.id;
  }

  @Watch("bannerName", { deep: true })
  handleName() {
    this.showOcrBtn();
  }

  mounted() {
    console.log("传进来的website", typeof this.website);
    this.showOcrBtn();
    this.types = this.$route.params.type;
    this.rid = this.$route.params.id;
  }

  showOcrBtn() {
    if (this.website !== "" && this.website !== undefined) {
      this.showOcr = true;
    } else {
      this.showOcr = false;
    }
  }

  linkToAPI() {
    if (this.apiId == -1) {
      this.$message.error("需要尽快配置");
      return;
    } else {
      this.$router.push({
        path: "/main/document/insertDoc/4",
        query: {
          apiId: this.apiId
        }
      });
    }
  }

  showModal() {
    this.consultVisible = true;
    this.appearModal = true;
  }

  controlModal(fade: boolean) {
    this.consultVisible = fade;
  }

  toOcrPage() {
    if (this.$store.state.user.username !== null) {
      window.open(this.website);
    } else {
      this.$router.push({
        path: "/login",
        query: {
          prePage: "templateList"
        }
      });
    }

    // 后续修改为动态
    // this.$router.push({
    //   path: this.website
    // });
  }

  toWebsite() {
    const token = cache.localGet("ai-front-token");
    const username = cache.localGet("username");
    let newtoken = window.btoa(token);
    this.websiteUrl =
      this.website + "?token=" + newtoken + "&username=" + username;
  }
}
</script>
<style lang="scss" scoped>
@import "../css/Banner.scss";
</style>
