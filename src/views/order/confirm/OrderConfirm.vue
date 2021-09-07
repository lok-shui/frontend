<template>
  <div class="bgColor">
    <div class="orderConfirm">
      <div class="top flex">
        <div>
          <a-icon type="left" @click="tologin" />
        </div>
        <div>XXX服务</div>
        <div></div>
      </div>
      <div class="contern">
        <div class="banner">
          <div class="consult">
            <div class="consult_l">
              <a-icon type="phone" />了解详情，咨询客户经理
            </div>
            <div class="consult_r">确定订单</div>
          </div>
        </div>
        <div class="usernews">
          <div class="usercontent">
            <div class="usercontent_l">公司</div>
            <div>{{ usernews.company_name }}</div>
          </div>
          <div class="usercontent">
            <div class="usercontent_l">客户名称</div>
            <div>{{ usernews.user_name }}</div>
          </div>
        </div>
        <div class="service">
          <b>购买服务</b>
          <div class="servicelist" v-for="(item, key) in oderdata" :key="key">
            <div class="servicecontent">
              <div class="flex header">
                <div>{{ item.service_name }}</div>
                <div>
                  <a-icon
                    theme="filled"
                    type="pay-circle"
                    class="priceicon"
                  />{{ item.price }}
                </div>
              </div>
              <div class="flex">
                <div class="flex text">
                  <div class="servicecontent_l">交付形态</div>
                  <div class="text">
                    {{
                      item.access_method == "API"
                        ? "API"
                        : item.access_method == "SDK"
                        ? "SDK"
                        : item.access_method == "APK"
                        ? "APK"
                        : "设备授权数"
                    }}
                  </div>
                </div>
                <div class="flex text">
                  <div class="servicecontent_l pf">计费方式</div>
                  <div class="text">
                    {{
                      item.billing_method == "BY_TIME"
                        ? "按时计费"
                        : item.billing_method == "BY_NUMBER"
                        ? "按量计费"
                        : item.billing_method == "BY_PACKAGE"
                        ? "包量计费"
                        : "设备授权数"
                    }}
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="flex text">
                  <div class="servicecontent_l">购买数量</div>
                  <div class="text">{{ item.buy_count }}</div>
                </div>
                <div class="flex text">
                  <div class="servicecontent_l pf">有效期</div>
                  <div class="text">{{ item.service_valid_desc }}</div>
                </div>
              </div>
              <div class="introduce">
                <b>服务介绍</b>
                <div
                  v-show="lookindex == key && showdetail"
                  class="servicenews"
                >
                  {{ item.desc }}
                </div>
              </div>
              <div class="detale" @click="lookdetail(key)">
                <span>{{ showdetail ? "收起" : "详情" }}</span>
                <a-icon type="down" v-if="showdetail" />
                <a-icon type="up" v-else />
              </div>
            </div>
          </div>
          <div class="total">
            <div>
              <span style="color: rgba(165, 165, 165, 1); font-weight: 500"
                >总计 </span
              ><span>￥{{ usernews.original_price }}</span>
            </div>
            <div class="actual">
              <span style="color: rgba(165, 165, 165, 1); font-weight: 500"
                >实付 </span
              >￥<span
                style="color: rgba(243, 41, 70, 1); font-size: 0.64rem"
                >{{ usernews.actual_price }}</span
              >
            </div>
          </div>
          <p style="color: rgba(0, 0, 0, 0.25); font-size: 0.32rem">
            如果您有任何购买问题需要咨询，欢迎与您的客户经理联系沟通
          </p>
        </div>
      </div>
      <div class="footer flex">
        <div class="footer_l">
          <div class="phone">
            <a-icon type="phone" />
          </div>
          <span class="footer_user">
            <b style="color: rgba(0, 0, 0, 0.85)">{{
              usernews.creator_name
            }}</b>
            <div style="color: rgba(0, 0, 0, 0.65)">联系客户经理</div>
          </span>
        </div>
        <div class="footer_r" @click="changestatus">确定订单</div>
      </div>
    </div>
    <a-modal
      :visible="showoder"
      :confirm-loading="showoderLoading"
      @ok="showoderhandleOk"
      @cancel="handleCancel"
      :centered="true"
      :closable="false"
      width="80%"
      class="showoder"
    >
      <b style="">您是否确认该方案的服务及价格</b>
    </a-modal>
    <a-modal
      :visible="successshow"
      :centered="true"
      :closable="false"
      width="80%"
      class="successshow"
    >
      <p class="pt">恭喜您，该方案已确认</p>
      <p>客户经理即将与您沟通线下转账事宜，请注意接听来电</p>
      <a-button @click="iknow" class="btn">我知道了 </a-button>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import userOrder from "@/service/order";
import cache from "@/utils/cache";
const userorder = userOrder.getOrder();
@Component({
  beforeRouteEnter(to, from, next) {
    let token = cache.localGet("ai-front-token");
    let username = cache.localGet("username");
    if (token == undefined && username !== to.query.username) {
      console.log(2323);

      let oderId = to.query.oderid;
      cache.localSet("oderId", oderId);
      next("/orderlogin");
    } else if (token !== undefined && username == to.query.username) {
      let oderId = to.query.oderid;
      cache.localSet("oderId", oderId);
    }
    next();
  }
})
export default class OrderHomePage extends Vue {
  showdetail: boolean = false;
  oderId: string = "";
  oderdata: Array<any> = [];
  usernews: any = "";
  lookindex: any = "";
  showoder: boolean = false;
  successshow: boolean = false;
  showoderLoading: boolean = false;
  created() {
    this.oderId = cache.localGet("oderId");
    this.putOrderDetails();
    console.log(this.oderId);
  }
  async putOrderDetails() {
    let data = {
      buy_order_id: this.oderId
    };
    console.log("this.oderId", data);
    const res = await userorder.putOrderDetails(data);
    if (res) {
      console.log("11res", res);
      this.usernews = res;
      this.oderdata = res.detail;
      this.oderdata.map(item => {
        item.desc = "一、服务介绍" + `\n` + item.service_introduction;
        if (item.service_desc !== null) {
          item.desc =
            "一、服务介绍" +
            `\n` +
            item.service_introduction +
            `\n` +
            "二、服务说明：" +
            `\n` +
            item.service_desc;
        }
      });
    }
  }
  async getOrderDetails() {
    let data = {
      buy_order_id: this.oderId
    };
    const res = await userorder.getOrderDetails(data);
    if (res) {
      console.log("22res", res);
      this.showoder = false;
      // this.$message.success("您已确认订单");
      this.successshow = true;
    }
  }
  lookdetail(index: any) {
    if (this.lookindex == index) {
      this.showdetail = !this.showdetail;
    } else {
      this.showdetail = true;
    }
    this.lookindex = index;
  }
  showoderhandleOk(e: any) {
    this.getOrderDetails();
  }
  handleCancel(e: any) {
    this.showoder = false;
  }
  changestatus() {
    this.showoder = true;
  }
  iknow() {
    this.successshow = false;
  }
  tologin() {
    this.$router.push("/orderlogin");
  }
}
</script>

<style lang="scss" scoped>
@import "./order.scss";
.banner {
  background: url("../../../assets/order/bill_banner@2x.png") no-repeat;
  background-size: cover;
}
</style>
