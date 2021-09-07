<template>
  <div class="myuse">
    <div class="header">
      <b class="title">应用列表</b>
      <a-button
        type="danger"
        @click="createuse"
        style="background: rgba(220, 8, 22, 1)"
      >
        + 创建应用
      </a-button>
    </div>
    <a-table
      :data-source="datalist"
      :columns="columns"
      :pagination="false"
      rowKey="id"
    >
      <template slot="status" slot-scope="status">
        <span
          :class="[
            { statusBlue: status == '运行中' },
            { statusBlack: status == '已暂停' }
          ]"
          >{{ status }}</span
        >
      </template>
      <template slot="createTime" slot-scope="createTime">
        <span>{{ createTime | formatDate("YYYY-MM-DD HH:mm") }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="detail(record.id)" class="hoverStyle">查看详情</a>
      </span>
    </a-table>
    <a-pagination
      v-model="currentpage"
      :total="totals"
      show-less-items
      hideOnSinglePage
      @change="pagechange"
      class="pagination"
      :page-size-options="['10']"
    />
    <!-- 弹出框 -->
    <a-modal :visible="visible" @cancel="handleCancel">
      <img src="@/assets/jingao.png" alt="" />
      <p class="pfrist">您未有可使用的服务</p>
      <p class="psecond">请先填写工单申请购买或试用服务</p>
      <a-button style="background: #dc0816; color: #fff" @click="towoker">
        提交工单
      </a-button>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UserService from "@/service/user";
import { cloneDeep } from "lodash";
import cache from "@/utils/cache";
import { timeFormat } from "@/utils/timeFormat";
const userService = UserService.getUserService();

@Component
export default class UserInfo extends Vue {
  // 应用名称
  useName: [] = [];
  // 计费类型
  useTypes: [] = [];
  // 分页器
  currentpage: number = 1;
  totals: number = 10;
  pageSizeOptions: string[] = ["10", "20", "30", "40"];
  // 每页显示条数
  pageSize: number = 10;
  columns: any = [
    {
      title: "应用名称",
      dataIndex: "appName",
      width: "20%"
    },
    {
      title: "APP ID",
      dataIndex: "id",
      width: "20%"
    },
    {
      title: "API KEY",
      dataIndex: "apiKey",
      width: "25%"
    },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" },
      width: "10%"
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      scopedSlots: { customRender: "createTime" },
      width: "15%"
    },
    {
      title: "操作",
      dataIndex: "action",
      scopedSlots: { customRender: "action" },
      width: "10%"
    }
  ];
  // 控制弹出框显示
  visible: boolean = false;
  datalist: any = [];
  currentTime: any = "";
  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.$store.dispatch("getUserInfo");
    this.getUseLists();
    this.currentTime = new Date().getTime();
    console.log("this.currentTime", this.currentTime);
  }
  get userInfo() {
    return this.$store.state.user;
  }
  // 获取应用列表
  async getUseLists() {
    const params = {
      page: this.currentpage,
      per_page: this.pageSize,
      order: "desc",
      sortBy: "createTime"
    };
    const useId = cache.localGet("ai-front-id");
    const useList = await userService.getUseLists(useId, params);
    console.log("this.useList", useList.data);
    // 生成datalist
    let { count } = useList.data;
    this.totals = Math.ceil(count / this.pageSize) * 10;
    this.datalist = useList.data.data;
    console.log(" this.data", this.datalist);
  }
  // 查看应用详情
  detail(key: any) {
    console.log("key", key);
    this.$router.push("usedetails/" + key);
  }
  pagechange() {
    this.getUseLists();
  }
  // 判断是否有购买的服务，否则需创建工单
  createuse() {
    this.getUsechoice();
  }
  async getUsechoice() {
    const useId = cache.localGet("ai-front-id");
    // const params = {
    //   page: 1,
    //   per_page: 10,
    //   sortBy: "purchaseTime",
    //   order: "desc"
    // };
    const res = await userService.getUsechoic(useId);
    console.log("res", res);

    const resarr = Object.keys(res);
    if (!resarr.length) {
      this.visible = true;
      return;
    } else {
      this.$router.push("createuse");
    }
  }
  // 提交工单
  towoker() {
    this.$router.push("WorkOrderNew");
  }
  // 弹框
  handleCancel() {
    this.visible = false;
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";

.myuse {
  background-color: #fff;
  padding: 0 24px;
  box-sizing: border-box;
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
  }
  .pagination {
    float: right;
    margin-top: 20px;
  }
  .detail {
    color: rgba(0, 0, 0, 1);
    &:hover {
      color: rgba(220, 8, 22, 1);
    }
  }
}

/deep/.ant-modal-footer {
  display: none;
}

/deep/.ant-modal-body {
  text-align: center;
  width: 100%;
  height: 100%;
  .pfrist {
    font-size: 18px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    margin-top: 12px;
  }
  .psecond {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}
/deep/.ant-modal-content {
  width: 352px;
  height: 205px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
</style>
