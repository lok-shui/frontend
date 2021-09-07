<template>
  <div class="contactUs">
    <div class="headerBg">
      <div class="imgControl">
        <!-- <img src="@/assets/images/v2/aboutus_header.png" alt="" /> -->
      </div>
      <div class="centerWord">
        <img src="@/assets/images/v2/about_header_slogan.png" alt="" />
        <div class="ptxt">
          从量变到智变，从浅层升级到深度融合，NEXT——AI智变，从心赋能。
        </div>
      </div>
    </div>
    <div class="mainBg">
      <div class="redCard">
        <div class="img">
          <img src="@/assets/images/v2/about_card_new.png" alt="" />
        </div>
        <div class="img">
          <img src="@/assets/images/v2/about_card_empower.png" alt="" />
        </div>
        <div class="img">
          <img src="@/assets/images/v2/about_card_xaix.png" alt="" />
        </div>
        <div class="img">
          <img src="@/assets/images/v2/about_card_trustworthy.png" alt="" />
        </div>
      </div>
      <div class="about">
        <div class="largeSize">关于 DMAI</div>
        <div class="grayText">
          <div>
            暗物智能科技（以下简称“暗物智能”）于2017年创办，凝聚AI行业横跨中美两国的顶尖技术人才和管理团队，致力于打造新一代基于强认知的人工智能技术平台。
          </div>
          <div>
            基于颠覆性的“小数据、大任务”技术范式，通过统一及融合计算机视觉、认知科学、语言对话、机器学习、机器人学、博弈伦理六大领域，构建人工智能的高层认知架构，实现机器与人的通讯与协作。
          </div>
          <div>
            暗物智能以认知推理、常识学习、因果价值建模等新一代AI关键核心技术为主攻方向，打造“小数据、大任务”的认知AI技术范式。暗物智能的技术平台在需要深层次人机互动、个性化服务、情境理解等应用领域具有不可替代的巨大价值。目前已经在自适应教育、金融科技、泛娱乐等领域的实际业务中验证了技术和平台的通用性，持续创造价值并推动商业模式的革新。
          </div>
        </div>
      </div>
    </div>

    <div class="contactPhone">
      <div class="phoneItem">
        <div class="title"><span class="su"></span>联系我们</div>
        <div class="method">
          <div class="imgBox">
            <img src="@/assets/images/v2/about_icon_advisory.png" alt="" />
          </div>
          <div class="mobile">
            <div class="p1">售前咨询</div>
            <div class="p2">support@dm-ai.cn</div>
          </div>
        </div>
      </div>
      <div class="phoneItem">
        <div class="method">
          <div class="imgBox">
            <img src="@/assets/images/v2/about_icon_technology.png" alt="" />
          </div>
          <div class="mobile">
            <div class="p1">技术支持</div>
            <div class="p2">BD@dm-ai.cn</div>
          </div>
        </div>
      </div>
      <div class="phoneItem">
        <div class="method">
          <div class="imgBox">
            <img src="@/assets/images/v2/about_icon_wechat.png" alt="" />
          </div>
          <div class="mobile">
            <div class="p1">更多咨询</div>
            <div class="p1">请关注微信公众号</div>
          </div>
          <div class="wechat">
            <img src="@/assets/images/v2/about_wechat_qrcode.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class ContactUs extends Vue {}
</script>
<style lang="scss" scoped>
@import "./css/ContactUs.scss";
</style>
