<template>
  <div class="user-contain">
    <div class="title">服务记录</div>

    <div class="list-contain">
      <div class="operation-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item label="名称">
            <a-input
              v-decorator="['services', {}]"
              placeholder="请输入服务名称"
            ></a-input>
          </a-form-item>

          <a-form-item label="使用区间">
            <a-range-picker v-decorator="['date', {}]" :allowClear="false" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit">
              搜索
            </a-button>
            <a-button type="default" @click="clear">
              清除
            </a-button>
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
        <template slot="cost" slot-scope="cost">
          <span>{{ secondsFormat(cost) }}</span>
        </template>
        <template slot="createTime" slot-scope="createTime">
          <span>{{ createTime | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import moment from "moment";
import cache from "@/utils/cache";
import UserService from "@/service/user";
import { timeFormat } from "@/utils/timeFormat";

const userService = UserService.getUserService();

@Component
export default class UService extends Vue {
  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;

  columns: any[] = [
    { title: "订单号", dataIndex: "id" },
    { title: "服务名称", dataIndex: "service" },
    { title: "时长", dataIndex: "cost", scopedSlots: { customRender: "cost" } },
    { title: "状态", dataIndex: "status" },
    {
      title: "访问时间",
      dataIndex: "createTime",
      scopedSlots: { customRender: "createTime" }
    }
  ];
  tableData: any[] = [];

  get userInfo() {
    return this.$store.state.user;
  }

  created() {
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
    if (this.$store.state.user.username !== null) {
      this.getList();
    }
  }
  @Watch("$store.state.user", { deep: true })
  handleChanges() {
    if (this.$store.state.user.username == null) {
      this.$router.push("/login");
    }
    // console.log("监控userInfo", this.$store.state.user.username);
  }

  async getList() {
    const params = {
      page: this.page,
      per_page: this.pageSize,
      sortBy: "createTime",
      order: "asc"
    };
    const values = this.form.getFieldsValue();
    const { date, services } = values;
    if (date) {
      const [start, end] = date;
      console.log(start);
      console.log(date);
      Object.assign(params, {
        startTime: this.formatTime(start, "00:00:00"),
        endTime: this.formatTime(end, "23:59:59")
      });
    }

    if (services) {
      Object.assign(params, { services });
    }

    const userId = cache.localGet("ai-front-id");
    const response = await userService.getOrderList(userId, params);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.tableData = response.data;
  }

  formatTime(date: any, time: string) {
    return +new Date(`${moment(date).format("YYYY-MM-DD")} ${time}`);
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getList();
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.reset();
  }

  clear() {
    this.form.resetFields();
    this.reset();
  }

  reset() {
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getList();
  }

  // 转为时分秒
  secondsFormat(s: any) {
    return timeFormat(s);
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
</style>
