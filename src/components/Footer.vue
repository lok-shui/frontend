<template>
  <div class="footer-contain">
    <div class="footerWrap">
      <div class="logo">
        <img src="../assets/images/v2/footer_dmai_logo @2x.png" alt="" />
      </div>

      <div class="line"></div>

      <div class="words">
        <div class="top">
          <div class="lineItem">
            <div class="icons">
              <img src="../assets/images/v2/footer_icon_telphohne.png" alt="" />
            </div>
            <div class="phone">
              <div>联系电话</div>
              <div class="white">020-39275510</div>
            </div>
          </div>
          <div class="lineItem">
            <div class="icons">
              <img src="../assets/images/v2/footer_icon_business.png" alt="" />
            </div>
            <div class="phone">
              <div>商务合作</div>
              <div class="white">business@dm-ai.cn</div>
            </div>
          </div>
        </div>

        <div class="bottomLine">
          广东省广州市南沙区金隆路37号香江国际科创中心16楼
        </div>
        <div class="bottomLine2">
          <span class="gap">隐私政策</span>© 2018-2020 DMAI版权所有
          粤ICP备19003499号-1
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class AiFooter extends Vue {}
</script>

<style lang="scss" scoped>
.footer-contain {
  width: 100%;
  border: 1px solid rgba(50, 51, 51, 1);
  background: rgba(50, 51, 51, 1);
  color: white;
  // height: 320px;
  position: relative;
  top: 74px;
  .footerWrap {
    width: 1200px;
    height: 240px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    padding-top: 59px;
    padding-bottom: 56px;
    .logo {
      width: 78px;
      height: 125px;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .line {
      width: 1px;
      // height: 188px;
      margin: 0 40px;
      background: #858585;
    }

    .words {
      color: rgba(255, 255, 255, 0.65);
      // width: 76%;
      .white {
        color: #fff;
        font-weight: bold;
      }
      .top {
        display: flex;
        margin-bottom: 32px;
        .lineItem {
          display: flex;
          margin-right: 57px;
          .icons {
            width: 40px;
            height: 40px;
            img {
              max-width: 100%;
            }
          }
          .phone {
            text-align: left;
            margin-left: 8px;
          }
        }
        .rightTop {
          font-size: 34px;
          display: flex;
          .weibo {
            margin-left: 30px;
          }
        }
      }
      .bottomLine,
      .bottomLine2 {
        text-align: left;
        color: rgba(255, 255, 255, 0.65);
        line-height: 20px;
        span {
          margin-right: 8px;
        }
      }
      .bottomLine2 {
        margin-top: 8px;
      }
    }
  }
}
</style>
