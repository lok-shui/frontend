<template>
  <div class="app">
    <!-- 头部导航栏 -->
    <ai-nav />
    <!-- 中间内容 -->
    <div class="content-contain ">
      <router-view></router-view>
    </div>
    <!-- 底部 -->
    <ai-footer v-if="!fadeFooter" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import cache from "@/utils/cache";
import AiFooter from "@/components/Footer.vue";
import AiNav from "@/components/Nav.vue";
import LoginService from "@/service/login";

const loginService = LoginService.getLoginService();

@Component({
  components: {
    AiFooter,
    AiNav
  }
})
export default class Main extends Vue {
  containHeight: number = 0;
  fadeFooter: boolean = false;

  created() {
    const id = cache.localGet("ai-front-id");
    const dmid = cache.localGet("dmid");
    if (!id && !dmid) {
      loginService.logout();
      return;
    }
  }

  @Watch("containHeight", { deep: true })
  handleChange() {
    this.containHeight = document.body.clientHeight;
  }

  // 如果是模板的编辑页面就不显示底部
  @Watch("$route")
  routechange() {
    this.fadeFoot();
  }

  mounted() {
    // 如果是模板的编辑页面就不显示底部
    this.fadeFoot();
    this.containHeight = document.body.clientHeight;
    const footer: any = document.getElementsByClassName("footer-contain")[0]
      .clientHeight;
    if (this.containHeight > 1104) {
      this.containHeight == 1329 - 74 - footer;
    } else {
      this.containHeight = 1104 - 74 - footer;
    }
  }

  fadeFoot() {
    if (this.$route.path == "/main/OCR/templateEdit") {
      this.fadeFooter = true;
    } else {
      this.fadeFooter = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  height: 100%;
}

.main {
  height: auto;
  min-height: calc(100% - 160px);
  background-color: #f0f2f5;
}

.content-contain {
  position: relative;
  top: 74px;
  // min-height: calc(100vh - 394px);
  min-height: calc(100vh - 326px);
  overflow: auto;
  background-color: #fff;
}
.clearfix {
  display: inline-block;
  &::after {
    display: block;
    content: ".";
    height: 0;
    line-height: 0;
    clear: both;
    visibility: hidden;
  }
}
</style>
