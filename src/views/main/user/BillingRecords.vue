<template>
  <div class="billrecord">
    <div class="header">
      <b class="title">账单记录列表</b>
      <a-form class="formstyle">
        <a-select
          allowClear
          style="margirright: 16px; width: 180px"
          @change="handleSelectChange"
          :placeholder="selectdata.name"
        >
          <a-select-option
            :value="item.serviceId"
            v-for="(item, index) in selectdata.select"
            :key="index"
          >
            {{ item.serviceName }}
          </a-select-option>
        </a-select>
        <RangePicker name="购买时间" @dateChange="onChange" />
      </a-form>
    </div>
    <div class="table">
      <a-table
        :columns="billcolumns"
        :data-source="billdata"
        :pagination="false"
      >
        <template slot="serviceName" slot-scope="serviceName, recode">
          <span v-if="recode.website == undefined">{{ serviceName }}</span
          ><a :href="recode.website" v-else class="website">{{
            serviceName
          }}</a>
        </template>
        <template slot="purchaseTime" slot-scope="purchaseTime">
          <span>{{ purchaseTime | formatDate("YYYY-MM-DD HH:mm") }}</span>
        </template>
        <template slot="serviceValidEndTime" slot-scope="serviceValidEndTime">
          <span v-if="typeof serviceValidEndTime == 'string'">{{
            serviceValidEndTime
          }}</span>
          <span v-else>{{
            serviceValidEndTime | formatDate("YYYY-MM-DD HH:mm")
          }}</span>
        </template>
        <template slot="accessType" slot-scope="accessType">
          <span>{{ accessType == undefined ? "正式接入" : accessType }}</span>
        </template>
        <template slot="status" slot-scope="status">
          <span
            :class="[
              {
                statusRed:
                  status == '已到期' || status == '已用完' || status == '已过期'
              },
              {
                statusYellow: status == '即将到期'
              },
              { statusGreen: status == '已接入' },
              {
                statusBlack:
                  status == '未接入' ||
                  status == '暂未激活' ||
                  status == '暂未接入'
              }
            ]"
            >{{ status }}</span
          >
        </template>
        <template slot="action" slot-scope="action, recode">
          <span
            @click="operation(action, recode.serviceId)"
            :class="action == '-' ? 'col' : 'hoverStyle'"
          >
            {{ action }}</span
          >
        </template>
      </a-table>
    </div>
    <a-pagination
      v-model="currentpage"
      :total="totals"
      show-less-items
      hideOnSinglePage
      @change="pagechange"
      class="pagination"
    />
    <modal
      :visible="visible"
      :imgSrc="imgSrc"
      :message="message"
      @changevisible="changevisible"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserService from "@/service/user";
import { cloneDeep } from "lodash";
import cache from "@/utils/cache";
import { useTime, useNum } from "@/utils/timeFormat";
import RangePicker from "@/views/main/user/components/RangePicker.vue"; // 日期组件
import modal from "@/views/main/user/components/modal.vue"; // 日期组件
import moment from "moment";
const userService = UserService.getUserService();
@Component({
  components: {
    RangePicker,
    modal
  }
})
export default class UserInfo extends Vue {
  // 选择器数据
  selectdata: any = {
    name: "全部服务",
    select: []
  };

  // 工单标题
  billcolumns: any = [
    {
      title: "服务名称",
      dataIndex: "serviceName",
      scopedSlots: { customRender: "serviceName" }
    },
    {
      title: "接入方式",
      dataIndex: "useMethod"
    },
    {
      title: "计费方式",
      dataIndex: "billingType"
    },
    {
      title: "接入类型",
      dataIndex: "accessType",
      scopedSlots: { customRender: "accessType" }
    },
    {
      title: "购买数量",
      dataIndex: "account"
    },
    {
      title: "剩余可用数量",
      dataIndex: "surplusAmount"
    },
    {
      title: "到期时间",
      dataIndex: "serviceValidEndTime",
      scopedSlots: { customRender: "serviceValidEndTime" }
    },
    {
      title: "购买时间",
      dataIndex: "purchaseTime",
      scopedSlots: { customRender: "purchaseTime" }
    },
    {
      title: "服务状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" },
      width: "100px"
    },
    {
      title: "操作",
      dataIndex: "action",
      scopedSlots: { customRender: "action" }
    }
  ];
  statustyle: string = "";
  // 工单列表数据
  allbilldata: Array<any> = [];
  billdata: Array<any> = [];
  // 确认续费升级
  visible: boolean = false;
  imgSrc: any = "";
  message: string = "";
  currentpage: number = 1;
  totals: number = 1;
  parmesdata: any = {
    page: 1,
    per_page: "10",
    order: "desc",
    sortBy: "purchaseTime"
  };
  websites: string = "";
  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.getBillList(this.parmesdata);
    this.getBillService();
  }
  // 根据状态帅选数据
  handleSelectChange(value: string) {
    this.parmesdata = {
      ...this.parmesdata,
      serviceId: value,
      page: 1
    };
    this.getBillList(this.parmesdata);
  }
  // 获取账单列表数据
  async getBillList(params: any) {
    const useId = cache.localGet("ai-front-id");
    const res = await userService.getBillLists(useId, params);
    if (res) {
      console.log("res", res);
      this.allbilldata = res.data;
      this.totals = res.totalPages * 10;
      // 判断服务状态
      const currenttime = new Date().getTime();
      this.allbilldata.map(item => {
        console.log("website", item.website);

        // 状态和有效期管理
        const endtime = item.serviceValidEndTime;
        // 购买数量格式转换
        if (item.unit == "次") {
          console.log("item.account", item.account);
          item.account = useNum(item.account);
          item.surplusAmount = useNum(item.surplusAmount);
        } else if (item.unit == "小时") {
          item.surplusAmount =
            item.surplusAmount < 0
              ? "-" + useTime(item.surplusAmount)
              : useTime(item.surplusAmount);
          item.account = item.account + item.unit;
        } else {
          item.surplusAmount = item.surplusAmount + item.unit;
          item.account = item.account + item.unit;
        }
        //    状态  0.暂未接入 1.已接入  2.已用完
        //  前端根据serviceValidEndTime 来判断是否过期而快过期
        //    状态为1  并且serviceValidEndTime为null  则为长期
        //   状态为0   并且serviceValidEndTime为nul    还没激活
        const restime = Math.ceil(
          (item.serviceValidEndTime - currenttime) / 1000 / 60 / 60 / 24
        );
        item.action = "-";
        if (item.status == 0) {
          if (item.serviceValidType == "按用户激活时间计算（不推荐使用）") {
            item.status = "暂未激活";
            item.serviceValidEndTime = `激活后${item.activeCount}天`;
          } else {
            item.status = "暂未接入";
            if (restime <= 0) {
              item.status = "已过期";
              item.action = "续费";
            } else if (restime <= 7 && restime > 0) {
              item.status = "即将到期";
              item.action = "续费";
            }
          }
        } else {
          if (item.status == 1) {
            item.status = "已接入";
            if (restime <= 0) {
              item.status = "已过期";
              item.action = "续费";
            } else if (restime <= 7 && restime > 0) {
              item.status = "即将到期";
              item.action = "升级额度";
            }
          } else if (item.status == 2) {
            if (restime <= 0) {
              item.status = "已过期";
              item.action = "续费";
            } else {
              item.status = "已用完";
              item.action = "升级额度";
            }
          }
        }
        if (item.useMethod == "私有化部署") {
          item.serviceValidEndTime = "长期";
        }
      });
      this.billdata = this.allbilldata;
      // 对话流链接跳转
      const token = cache.localGet("ai-front-token");
      const username = cache.localGet("username");
      let newtoken = window.btoa(token);
      this.billdata.map(item => {
        if (item.website !== undefined) {
          item.website =
            item.website + "?token=" + newtoken + "&username=" + username;
        }
      });
    }
  }
  // 获取购买时间日期,并帅选数据
  formatTime(date: any, time: string) {
    return +new Date(`${moment(date).format("YYYY-MM-DD")} ${time}`);
  }
  onChange(date: any) {
    if (date.length == 0) {
      this.parmesdata = {
        ...this.parmesdata,
        startTime: null,
        endTime: null
      };
    } else {
      Object.assign(this.parmesdata, {
        startTime: this.formatTime(new Date(date[0]), "00:00:00"),
        endTime: this.formatTime(new Date(date[1]), "23:59:59")
      });
    }

    this.getBillList(this.parmesdata);
  }
  // 分页器
  pagechange() {
    this.parmesdata.page = this.currentpage;
    console.log("this.currentpage", this.currentpage);
    console.log("this.parmesdata", this.parmesdata);

    this.getBillList(this.parmesdata);
  }
  // 操作
  changevisible(show: boolean) {
    console.log(show);

    this.visible = show;
  }
  operation(str: string, id: any) {
    console.log(str);
    // if (str == "查看文档") {
    //   console.log(id);
    //   this.$router.push({
    //     path: "/main/document/insertDoc/" + id
    //   });
    // }
    if (str == "-") return;
    this.visible = true;
    this.message = "您可以通过提交工单来升级额度或续费";
    this.imgSrc = require("@/assets/jingao.png");
  }
  // 获取用户的服务列表
  async getBillService() {
    const useId = cache.localGet("ai-front-id");
    const res = await userService.getBillService(useId);
    if (res) {
      console.log("getBillService", res);
      this.selectdata.select = res;
      console.log(this.selectdata);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
.billrecord {
  /deep/.ant-form-item {
    display: flex;
    margin-bottom: 0;
  }
  /deep/.ant-form-item-label {
    line-height: 32px;
    font-size: 14px;
    font-weight: 400;
  }
  /deep/.ant-select-selection {
    width: 180px;
    height: 32px;
  }
  /deep/.ant-calendar-picker-input {
    width: 256px;
    height: 32px;
  }
  /deep/.ant-form-item-children {
    display: flex;
  }
  /deep/.ant-select {
    margin-right: 16px;
  }
  background-color: #fff;
  padding: 23px 32px;
  box-sizing: border-box;
  min-height: 100%;
  .header {
    margin-bottom: 24px;
    text-align: left;
    .formstyle {
      display: flex;
      margin-top: 16px;
    }
  }
  .pagination {
    float: right;
    margin-top: 20px;
  }
}
</style>
