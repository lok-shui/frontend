<template>
  <div class="user-contain">
    <div class="list-contain">
      <div class="topLine">
        <b class="titleSize">工单列表</b>
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item label="状态">
            <a-select
              allowClear
              class="inputWidth"
              v-decorator="['services', {}]"
              placeholder="请选择工单状态"
              @change="handleSelectChange"
            >
              <a-select-option
                :value="item"
                v-for="(item, index) in statuslist"
                :key="index"
              >
                {{ item }}
              </a-select-option></a-select
            >
          </a-form-item>
          <a-form-item>
            <a-button class="newOrderBtn" @click="addNewOrder"
              >+创建工单</a-button
            >
          </a-form-item>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :dataSource="tableData"
        rowKey="id"
        :pagination="paginationConfig"
        @change="onPageChange"
      >
        <template slot="status" slot-scope="status">
          <span v-if="status == '处理中'" class="statusBg blueStatus"
            >处理中</span
          >
          <span v-if="status == '待处理'" class="statusBg greenStatus"
            >待处理</span
          >
          <span v-if="status == '已处理'" class="statusBg">已处理</span>
          <span v-if="status == '提交成功'" class="statusBg">提交成功</span>
        </template>
        <template slot="createAt" slot-scope="createAt">
          <span>{{ createAt | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import moment from "moment";
import cache from "@/utils/cache";
import UserService from "@/service/user";
import { timeFormat } from "@/utils/timeFormat";
import DocService from "@/service/doc";
const docService = DocService.getDocService();

const userService = UserService.getUserService();

@Component
export default class MyWorkOrder extends Vue {
  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;

  columns: any[] = [
    { title: "工单编号", dataIndex: "id" },
    { title: "相关产品与服务", dataIndex: "products" },
    {
      title: "问题类型",
      dataIndex: "type",
      scopedSlots: { customRender: "type" }
    },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "提交时间",
      dataIndex: "createAt",
      scopedSlots: { customRender: "createAt" }
    }
  ];
  tableData: any[] = [];
  statuslist: any[] = ["已处理", "处理中", "待处理", "提交成功"];
  statustype: any = null;
  get userInfo() {
    return this.$store.state.user;
  }

  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.form = this.$form.createForm(this, {});
    this.paginationConfig = {
      showQuickJumper: true,
      defaultCurrent: 1,
      defaultPageSize: this.pageSize,
      current: this.page,
      class: "my-pagination",
      pageSize: this.pageSize,
      hideOnSinglePage: true,
      total: this.totalCount,
      change: this.onPageChange
    };

    const params = {
      page: this.page,
      per_page: this.pageSize
    };
    if (this.$store.state.user.username !== null) {
      this.getWorkOrder();
    }
  }

  async getWorkOrder() {
    const userId = cache.localGet("ai-front-id");
    const params = {
      page: this.page,
      per_page: this.pageSize,
      status: this.statustype,
      user_id: userId
    };
    const response = await userService.getWorkOrder(params);
    if (response) {
      this.tableData = response.rows;
      this.totalCount = response.count;
      this.paginationConfig.total = this.totalCount;
      this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    }
  }

  addNewOrder() {
    this.$router.push("./WorkOrderNew");
  }

  formatTime(date: any, time: string) {
    return +new Date(`${moment(date).format("YYYY-MM-DD")} ${time}`);
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getWorkOrder();
  }

  handleSubmit(e: any) {
    e.preventDefault();
  }

  // 转为时分秒
  secondsFormat(s: any) {
    return timeFormat(s);
  }
  // 状态筛选
  handleSelectChange(value: string) {
    this.statustype = value;
    this.getWorkOrder();
  }
}
</script>

<style lang="scss" scoped>
@import "./css/workOrder.scss";
</style>
