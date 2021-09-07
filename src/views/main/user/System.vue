<template>
  <div class="System">
    <div class="service">
      <div class="serviceheader">
        <b class="title">服务调用累计</b>
        <div class="hoverStyle" @click="lookAll" v-show="showservicelist">
          查看全部<span class="symbol">&raquo;</span>
        </div>
      </div>
      <div class="servicelist">
        <EmptyStyle v-show="showempty" />
        <div
          class="list"
          v-for="(item, index) in servicelist"
          :key="index"
          v-show="showservicelist && index < 4"
        >
          <div class="inlist">
            <div :class="index == 0 ? 'textleft' : 'listtext'">
              <div>{{ item.serviceName }}</div>
              <div :class="index == 0 ? 'num' : ''">
                {{ item.count }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="appuse">
      <div class="appuseheader">
        <b class="title">应用累计</b>
      </div>
      <div class="appuselist">
        <div class="list" v-for="(item, index) in appuselist" :key="index">
          <div class="inlist">
            <div class="appplay">
              <span
                v-show="
                  item.count !== '0'
                    ? true
                    : item.name == '账单记录'
                    ? true
                    : false
                "
                :class="[
                  {
                    lookspan:
                      item.name !== '消息通知' && item.name !== '账单记录'
                  },
                  { hoverStyle: true }
                ]"
                @click="lookthis(item.pathlook)"
                >查看</span
              >
              <span
                v-show="item.name !== '消息通知' && item.name !== '账单记录'"
                class="hoverStyle"
                @click="createlist(item.pathcreate)"
                >创建</span
              >
            </div>
            <div>
              <div>{{ item.name }}</div>
              <div class="num">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="serviceAll">
      <div class="serviceAllheader">
        <b class="title">服务列表</b>
        <div class="more hoverStyle" @click="moreService">更多服务咨询</div>
      </div>
      <div class="servicetablist">
        <a-tabs :default-active-key="0" @tabClick="callback">
          <a-tab-pane :tab="item" v-for="item in servicetitle" :key="item">
            <a-table
              :columns="serviceAllcolumns"
              :data-source="serviceAlldata"
              :pagination="paginationConfig"
              @change="onPageChange"
            >
              <template slot="status" slot-scope="status">
                <span
                  :class="[
                    {
                      statusRed:
                        status == '已到期' ||
                        status == '已用完' ||
                        status == '已过期'
                    },
                    {
                      statusYellow: status == '即将到期'
                    },
                    { statusGreen: status == '已接入' || status == '运行中' },
                    {
                      statusBlack:
                        status == '暂未接入' ||
                        status == '暂未激活' ||
                        status == '暂无接入'
                    }
                  ]"
                  >{{ status }}</span
                >
              </template>
              <span slot="api" slot-scope="api, record">
                <a @click="playapi(api, record.serviceId)">
                  <a v-if="api == 0" class="col">暂不支持</a>
                  <div v-else-if="api == 1">
                    <a class="hoverStyle">申请试用</a>
                    <a class="hoverStyle">正式接入</a>
                  </div>
                  <!-- <a
                    v-else-if="api == 2"
                    class="hoverStyle"
                    @click="playapi(api, record.apiId)"
                    >查看文档</a
                  > -->
                  <a v-else-if="api == 2" class="col">-</a>
                  <div v-else-if="api == 3">
                    <a class="hoverStyle">升级额度</a>
                    <a class="hoverStyle">续费</a>
                  </div>
                  <div v-else-if="api == 4">
                    <a class="hoverStyle">续费</a>
                  </div>
                </a>
              </span>
              <span slot="sdk" slot-scope="sdk, record">
                <span @click="playapi(sdk, record.sdk)">
                  <a v-if="sdk == 0" class="col">暂不支持</a>
                  <div v-else-if="sdk == 1">
                    <a class="hoverStyle">申请试用</a>
                    <a class="hoverStyle">正式接入</a>
                  </div>
                  <div v-else-if="sdk == 2">
                    <!-- <a class="hoverStyle">下载SDK</a>
                    <a class="hoverStyle" @click="playapi(api, record.apiId)"
                      >查看文档</a
                    > -->
                    <a class="col">-</a>
                  </div>
                  <div v-else-if="sdk == 3">
                    <a class="hoverStyle">升级额度</a>
                    <a class="hoverStyle">续费</a>
                  </div>
                  <div v-else-if="sdk == 4">
                    <a class="hoverStyle">续费</a>
                  </div></span
                >
              </span>
            </a-table></a-tab-pane
          >
        </a-tabs>
      </div>
    </div>
    <!-- 弹出框 -->
    <a-modal :visible="isShow">
      <b style="font-size: 16px">需求已收到</b>
      <p>你的客服经理将马上与你联系办理 升级额度/续费服务。</p>
      <button class="btn" @click="handleOk">我知道了</button>
    </a-modal>
    <modal
      :visible="visible"
      :imgSrc="imgSrc"
      :message="message"
      :serviceId="serviceId"
      @changevisible="changevisible"
      @getNewWorkOrder="getNewWorkOrder"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import cache from "@/utils/cache";
import UserService from "@/service/user";
import EmptyStyle from "@/views/main/user/components/EmptyStyle.vue";
import modal from "@/views/main/user/components/modal.vue"; // 日期组件
import { useNum, useTime } from "@/utils/timeFormat";
import { RouteConfig } from "vue-router";
const userService = UserService.getUserService();

@Component({
  components: {
    EmptyStyle,
    modal
  },
  beforeRouteEnter(to, from, next) {
    if (
      to.query.token !== undefined &&
      to.query.username !== undefined &&
      to.query.userId !== undefined
    ) {
      let token: any = to.query.token;
      let username = to.query.username;
      let userId = to.query.userId;
      let usertoken = window.atob(token);
      cache.localSet("ai-front-token", usertoken);
      cache.localSet("ai-front-id", userId);
      cache.localSet("usernames", username);
      // debugger
    }
    next();
  }
})
export default class UService extends Vue {
  // 累计调用服务数据
  servicelist: Array<any> = [];
  showempty: boolean = false;
  showservicelist: boolean = false;
  // 累计应用数据
  appuselist: Array<any> = [];
  // 服务列表数据
  servicetitle: Array<any> = [];
  servicetablist: Array<any> = [];
  serviceAllcolumns: Array<any> = [
    {
      title: "服务名称",
      dataIndex: "serviceName",
      width: "25%"
    },
    {
      title: "使用状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" },
      width: "25%"
    },
    {
      title: "API",
      dataIndex: "api",
      scopedSlots: { customRender: "api" },
      width: "25%"
    },
    {
      title: "SDK",
      dataIndex: "sdk",
      scopedSlots: { customRender: "sdk" },
      width: "25%"
    }
  ];
  servicetabs: Array<any> = [];
  serviceAlldata: Array<any> = [];
  paginationConfig!: pageconfig;
  page: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  // 确认续费升级
  visible: boolean = false;
  imgSrc: any = require("@/assets/jingao.png");
  message: string = "您可以通过提交工单来升级额度或续费";
  isShow: boolean = false;
  serviceId: any = "";
  usernames: string = "";
  created() {
    this.usernames = cache.localGet("usernames");
    if (this.usernames !== null) {
      this.getUserId({ username: this.usernames });
      return;
    }
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.getSystemService(useId);
    this.getAppSummary(useId);
    this.getServiceSummary(useId);
    this.paginationConfig = {
      defaultCurrent: 1,
      defaultPageSize: this.pageSize,
      current: this.page,
      class: "my-pagination",
      pageSize: this.pageSize,
      hideOnSinglePage: true,
      total: this.totalCount,
      change: this.onPageChange
    };
  }
  mounted() {
    // 获取节点，点击添加交互样式
    const isclick: any = document.querySelectorAll(".hoverStyle");
    for (let i = 0; i < isclick.length; i++) {
      isclick[i].addEventListener("click", function() {
        isclick[i].style.color = "rgba(181,26,19,1)";
      });
    }
  }

  // 获取服务调用累计
  async getSystemService(useId: any) {
    if (useId == null) return;
    const res = await userService.getSystemService(useId);
    if (res) {
      if (res.count !== 0) {
        this.showservicelist = true;
        this.servicelist = res.usage_services;
        this.servicelist.map(item => {
          if (item.unit == "次") {
            item.count = useNum(item.count);
          } else if (item.unit == "小时") {
            item.count = useTime(item.count);
          } else {
            item.count = item.count + item.unit;
          }
        });
        this.servicelist.unshift({
          serviceName: "已有服务",
          count: res.count
        });
      } else {
        this.showempty = true;
      }
    }
  }
  // 获取应用累计
  async getAppSummary(useId: any) {
    const AppSummary = await userService.getAppSummary(useId);
    const WorkOrderCount = await userService.getWorkOrderCount(useId);
    AppSummary.workorderCount = WorkOrderCount;
    this.appuselist = [
      {
        name: "已建应用",
        count: "0",
        pathlook: "uselist",
        pathcreate: "createuse",
        appname: "applicationCount"
      },
      {
        name: "已有工单",
        count: "0",
        pathlook: "WorkOrderList",
        pathcreate: "WorkOrderNew",
        appname: "workorderCount"
      },
      {
        name: "账单记录",
        count: "0",
        pathlook: "billingrecords",
        pathcreate: "billingrecords",
        appname: "purchaseCount"
      }
      // { name: "消息通知", count: "0", pathlook: "", appname: "messageCount" },
    ];
    this.appuselist.map(item => {
      if (AppSummary[item.appname]) {
        item.count = AppSummary[item.appname];
      }
    });
  }
  // 获取服务列表
  async getServiceSummary(useId: any) {
    const res = await userService.getServiceSummary(useId);
    // console.log("res", res);
    if (res) {
      console.log("res", res);
      this.servicetitle = Object.keys(res);
      this.servicetabs = res;
      let servicedarr: Array<any> = this.servicetabs[this.servicetitle[0]];
      for (let k = 1; k <= Math.ceil(servicedarr.length / 5); k++) {
        const list: Array<any> = [];
        servicedarr.forEach((item, i) => {
          if (i >= (k - 1) * 5 && i < k * 5) {
            list.push(item);
          }
        });
        this.servicetablist[k] = {
          servicelist: list
        };
      }
      this.totalCount = servicedarr.length;
      this.paginationConfig.total = this.totalCount;
      this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
      this.serviceAlldata = this.servicetablist[this.page].servicelist;
    }
  }
  changecervice(lists: Array<any>) {
    this.servicetablist = [];
    for (let k = 1; k <= Math.ceil(lists.length / 5); k++) {
      const list: Array<any> = [];
      lists.forEach((item, i) => {
        if (i >= (k - 1) * 5 && i < k * 5) {
          list.push(item);
        }
      });
      this.servicetablist[k] = {
        servicelist: list
      };
    }
    this.serviceAlldata = this.servicetablist[this.page].servicelist;
    this.totalCount = lists.length;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
  }
  // 点击查看和创建跳转
  lookthis(name: string) {
    this.$router.push(name);
  }
  createlist(name: string) {
    this.$router.push(name);
  }
  // 服务列表切换
  callback(key: any) {
    let list = this.servicetabs[key];
    this.page = 1;
    this.changecervice(list);
  }
  // 查看全部
  lookAll() {
    this.$router.push("databoard");
  }
  // 更多服务咨询
  moreService() {
    this.$router.push("WorkOrderNew");
  }
  // 列表点击操作
  playapi(api: any, id: any) {
    switch (api) {
      case 0:
        break;
      case 1:
        this.$router.push("WorkOrderNew");
        break;
      case 2:
        // this.$router.push({
        //   path: "/main/document/insertDoc/" + id,
        // });
        break;
      case 3:
        // this.visible = true;
        // this.serviceId = id;
        this.$router.push("WorkOrderNew");
        break;
      case 4:
        this.$router.push("WorkOrderNew");
        // this.visible = true;
        // this.serviceId = id;
        break;
    }
  }
  handleOk() {
    this.isShow = false;
  }
  // 点击续费提交工单
  async getNewWorkOrder() {
    const param = {
      uid: this.$store.state.user.id,
      products: String(this.serviceId),
      type: "续费咨询",
      platform: "Android",
      accessMethod: "API"
    };
    const response = await userService.getNewWorkOrder(param);
    if (response) {
      this.visible = false;
      this.isShow = true;
    }
  }
  changevisible(show: boolean) {
    this.visible = show;
  }
  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.serviceAlldata = this.servicetablist[this.page].servicelist;
  }
  async getUserId(useId: any) {
    const res: Array<any> = await userService.getUserId(useId);
    res.map(item => {
      if (item.username == this.usernames) {
        cache.localSet("ai-front-id", item.id);
      }
    });
    let id = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.getSystemService(id);
    this.getAppSummary(id);
    this.getServiceSummary(id);
    this.paginationConfig = {
      defaultCurrent: 1,
      defaultPageSize: this.pageSize,
      current: this.page,
      class: "my-pagination",
      pageSize: this.pageSize,
      hideOnSinglePage: true,
      total: this.totalCount,
      change: this.onPageChange
    };
    cache.localRemove("usernames");
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";

.System {
  background: rgba(240, 242, 245, 1);
  .service {
    @extend .pad;
    .serviceheader {
      @extend .flexs;
      margin-bottom: 16px;
      .symbol {
        font-size: 18px;
      }
    }
    .servicelist {
      display: flex;
      .list {
        .inlist {
          @extend .liststyle;
          padding: 24px;
        }

        .listtext {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  .textleft {
    text-align: left;
  }
  .num {
    font-size: 36px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 38px;
  }
  .appuse {
    @extend .pad;
    .appuseheader {
      margin-bottom: 16px;
    }
    text-align: left;
    .appuselist {
      display: flex;
      .list {
        .inlist {
          @extend .liststyle;
          padding: 10px 14px 32px 32px;
        }
        .appplay {
          cursor: pointer;
          text-align: right;
          .lookspan {
            margin-right: 20px;
          }
          > * {
            &:hover {
              color: rgba(220, 8, 22, 1);
            }
          }
        }
      }
    }
  }
  .serviceAll {
    @extend .pad;
    .serviceAllheader {
      @extend .flexs;
      margin-bottom: 16px;
      .more {
        width: 116px;
        height: 32px;
        line-height: 32px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 5px;
      }
    }
    .servicetablist {
      text-align: left;
    }
  }
}
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-modal-close {
  display: none;
}
/deep/.ant-modal-content {
  min-width: 389px;
  height: 148px;
  padding: 24px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: relative;
  b {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin-top: 12px;
  }
  .btn {
    cursor: pointer;
    padding: 2px 8px 3px;
    background: rgba(220, 8, 22, 1);
    border-radius: 2px;
    color: #fff;
    position: absolute;
    right: 24px;
    bottom: 24px;
  }
}
/deep/.ant-modal-body {
  padding: 0;
  .ant-btn {
    float: right;
    width: 72px;
    height: 24px;
    background: rgba(220, 8, 22, 1);
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
  }
}
</style>
