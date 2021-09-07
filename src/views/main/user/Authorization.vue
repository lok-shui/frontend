<template>
  <div class="user-contain">
    <div class="title">授权管理</div>

    <div class="list-contain">
      <div class="operation-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <!-- <a-form-item label="名称">
            <a-input v-decorator="['name', {}]" placeholder="请输入"></a-input>
          </a-form-item> -->

          <a-form-item label="购买时间">
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
        <template slot="surplusTimes" slot-scope="surplusTimes">
          <span>{{ secondsFormat(surplusTimes) }}</span>
        </template>

        <!--年月日时分秒 YYYY-MM-DD HH:mm:ss -->
        <template slot="purchaseTime" slot-scope="purchaseTime">
          <span>{{ purchaseTime | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
        <template slot="purchasesTotalTimes" slot-scope="purchasesTotalTimes">
          <span>{{ secondsFormat(purchasesTotalTimes) }}</span>
        </template>
        <template slot="renewTime" slot-scope="renewTime">
          <div class="timeItem">
            <span v-if="renewTime">{{
              renewTime | formatDate("YYYY-MM-DD HH:mm:ss")
            }}</span>
            <span v-else class="null">—</span>
          </div>
        </template>
        <template slot="expirationDate" slot-scope="expirationDate">
          <span>{{ expirationDate | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import moment from "moment";
import UserService from "@/service/user";
import { timeFormat } from "@/utils/timeFormat";

declare var window: Window & { webkit: any };

const userService = UserService.getUserService();

@Component
export default class UserAuthorization extends Vue {
  get username() {
    return this.$store.state.user.username;
  }
  get userId() {
    return this.$store.state.user.id;
  }

  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  columns: any[] = [
    { title: "token", dataIndex: "accessToken", width: 200 },
    // { title: "用户名", dataIndex: "username" , width: 120},
    { title: "服务名称", dataIndex: "resourceIds" },
    {
      title: "购买总时长",
      width: 120,
      dataIndex: "purchasesTotalTimes",
      scopedSlots: { customRender: "purchasesTotalTimes" }
    },
    {
      title: "剩余时长",
      dataIndex: "surplusTimes",
      width: 120,
      scopedSlots: { customRender: "surplusTimes" }
    },
    {
      title: "到期时间",
      dataIndex: "expirationDate",
      width: 120,
      scopedSlots: { customRender: "expirationDate" }
    },
    {
      title: "购买时间",
      width: 120,
      dataIndex: "purchaseTime",
      scopedSlots: { customRender: "purchaseTime" }
    },
    {
      title: "续费时间",
      dataIndex: "renewTime",
      width: 120,
      scopedSlots: { customRender: "renewTime" }
    }
  ];
  tableData: any[] = [];

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
      // username: this.username,
      // userId: this.userId,
      sortBy: "purchaseTime",
      order: "desc"
    };
    const values = this.form.getFieldsValue();
    const { date } = values;
    if (date) {
      const [start, end] = date;
      Object.assign(params, {
        registerTimeStart: this.formatTime(start, "00:00:00"),
        registerTimeEnd: this.formatTime(end, "23:59:59")
      });
    }

    const response = await userService.getAuthList(this.userId, params);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.tableData = response.data;
    // 获取时间差
    // this.tableData.forEach((item: any) => {
    //   const curt = (new Date().getTime())-item.expirationDate;
    //   let ab = item.expirationDate -new Date().getTime();
    //   const restTime = this.secondsFormat(ab/1000);
    //    Object.assign(item, { restTime:restTime });

    // });
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
.timeItem {
  color: gray;
  .null {
    color: #aaa;
    display: block;
    text-align: center;
  }
}
</style>
