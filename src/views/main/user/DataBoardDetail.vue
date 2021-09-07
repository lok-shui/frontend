<template>
  <div class="databoard">
    <div class="everydayuse">
      <b class="title">服务使用明细</b>
      <div class="selection">
        <div class="select">
          <a-select
            style="width: 180px"
            @change="changeapp"
            :value="defaultappname"
            :disabled="appselection.length < 2"
          >
            <a-select-option
              :value="item.appId"
              v-for="(item, index) in appselection"
              :key="index"
            >
              {{ item.appName }}
            </a-select-option>
          </a-select>
          <a-select
            style="width: 280px"
            @change="ChangeSummaryList"
            :value="defaultapiname"
            :disabled="apiselection.length < 2"
          >
            <a-select-option
              :value="item.serviceId + ',' + item.useMethod + ',' + item.name"
              v-for="(item, index) in apiselection"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <RangePicker @dateChange="onChange" />
        </div>
      </div>
      <div class="table">
        <a-table
          :columns="everydaycolumns"
          :data-source="everydaydata"
          :pagination="paginationConfig"
          @change="onPageChange"
        >
          <template slot="cost" slot-scope="cost, recode">
            <span>{{
              recode.billingType == "按时计费" ? cost : cost + recode.unit
            }}</span>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import UserService from "@/service/user";
import Select from "@/views/main/user/components/Select.vue"; // 选择器组件
import RangePicker from "@/views/main/user/components/RangePicker.vue"; // 日期组件
import cache from "@/utils/cache";
import { useTime } from "@/utils/timeFormat";
import moment from "moment";
const userService = UserService.getUserService();

@Component({
  components: {
    Select,
    RangePicker
  }
})
export default class UService extends Vue {
  // 服务使用选择器数据
  usedaydata: Array<any> = [
    { name: "全部应用", select: ["1", "2", "3", "4"] },
    { name: "全部API", select: ["5", "6", "7", "8"] }
  ];
  // 表格数据
  everydaycolumns = [
    {
      title: "流水号",
      dataIndex: "dmid",
      width: "30%"
    },
    {
      title: "APP ID",
      dataIndex: "appId",
      width: "20%"
    },
    {
      title: "服务名称",
      dataIndex: "serviceName",
      width: "15%"
    },
    {
      title: "使用数量",
      dataIndex: "cost",
      scopedSlots: { customRender: "cost" },
      width: "10%"
    },
    {
      title: "状态",
      dataIndex: "status",
      width: "10%"
    },
    {
      title: "时间",
      dataIndex: "date",
      scopedSlots: { customRender: "date" },
      width: "15%"
    }
  ];
  everydaydata: Array<any> = [];
  paginationConfig!: pageconfig;
  page: number = 1;
  pagesize: number = 10;
  totalCount: number = 0;
  useId: any = "";
  serviceId: any = "";
  usedate: any = "";
  useMethod: any = "";
  billing: any = "";
  appId: any = "";
  params: any = {
    page: this.page,
    per_page: this.pagesize,
    sortBy: "date",
    order: "desc"
  };
  // 服务使用选择器数据
  appselection: Array<any> = [];
  apiselection: Array<any> = [];
  defaultappname: string = "";
  defaultapiname: string = "";
  billingType: Array<any> = [];
  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.useId = cache.localGet("ai-front-id");
    this.serviceId = this.$route.params.serviceId;
    this.usedate = this.$route.params.date;
    this.useMethod = this.$route.params.useMethod;
    this.billing = this.$route.params.billingType;
    this.appId = this.$route.params.appId;
    console.log(this.serviceId);
    console.log("date", this.usedate);

    this.paginationConfig = {
      showQuickJumper: true,
      defaultCurrent: 1,
      defaultPageSize: this.pagesize,
      current: this.page,
      class: "my-pagination",
      pageSize: this.pagesize,
      hideOnSinglePage: true,
      total: this.totalCount,
      change: this.onPageChange
    };
    if (this.serviceId == undefined) {
      console.log("132132132");
      this.params = {
        ...this.params,
        type: 0
      };
      this.getSummaryList(this.params);
    } else {
      Object.assign(this.params, {
        startTime: this.formatTime(new Date(this.usedate), "00:00:00"),
        endTime: this.formatTime(new Date(this.usedate), "23:59:59")
      });
      this.params = {
        ...this.params,
        serviceId: this.serviceId,
        billingType: this.billing,
        appId: this.appId,
        useMethod: this.useMethod,
        type: 0
      };
      this.getSummaryList(this.params);
    }

    this.getConditionList(this.useId);
    this.getapplication(this.useId);
  }
  // 获取每天使用
  async getSummaryList(params: any) {
    const res = await userService.getSummaryList(this.useId, params);
    if (res) {
      console.log("数据看板", res);
      this.everydaydata = res.data;
      this.everydaydata.map(item => {
        if (item.billingType == "按时计费") {
          item.cost = useTime(item.cost);
        }
      });
      this.totalCount = res.count;
      this.paginationConfig.total = this.totalCount;
      this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    }
  }
  // 获取下拉应用
  async getapplication(userid: any) {
    const res = await userService.getapplication(userid);
    if (res) {
      this.appselection = res;
      if (res.length > 1) {
        this.appselection.unshift({ appName: "全部应用", appId: undefined });
        this.defaultappname = "全部应用";
      } else {
        this.defaultappname = res[0].appName;
      }
    }
  }
  // 获取下拉api
  async getConditionList(userid: any) {
    const res: Array<any> = await userService.getConditionList(userid);
    if (res) {
      // this.apiselection = res;
      let useMethod: Array<any> = [];
      let arr: Array<any> = [];
      if (res.length > 1) {
        arr = [
          {
            name: "全部服务",
            serviceId: null,
            useMethod: null
          }
        ];
        res.map(item => {
          useMethod.push(item.useMethod);
        });
        useMethod = Array.from(new Set(useMethod));
        console.log("useMethod", useMethod);
        useMethod.map(item => {
          arr.push({
            name:
              "全部" +
              (item == "PRIVATIZATION_DEPLOYMENT" ? "私有化部署" : item),
            serviceId: null,
            useMethod: item
          });
        });
        this.defaultapiname = "全部服务";
      } else {
        this.defaultapiname = res[0].name;
      }
      this.apiselection = [...arr, ...res];
    }
  }
  // 筛选功能
  changeapp(values: string) {
    console.log(values);
    if (values == undefined) {
      this.params = {
        ...this.params,
        appId: null,
        page: 1
      };
      this.defaultappname = "全部应用";
    } else {
      this.params = {
        ...this.params,
        appId: values,
        page: 1
      };
      this.defaultappname = values;
    }

    this.getSummaryList(this.params);
  }
  ChangeSummaryList(values: string) {
    console.log(values);
    let arr = values.split(",");
    if (arr[0] == "null") {
      this.params = {
        ...this.params,
        serviceId: null,
        useMethod: arr[1] == "null" ? null : arr[1],
        page: 1
      };
      this.defaultapiname = arr[2];
    } else {
      this.params = {
        ...this.params,
        serviceId: arr[0],
        useMethod: arr[1],
        page: 1
      };
      this.defaultapiname = arr[2];
    }

    this.getSummaryList(this.params);
  }
  // 切换时间段数据
  formatTime(date: any, time: string) {
    return +new Date(`${moment(date).format("YYYY-MM-DD")} ${time}`);
  }
  // 日期选择
  onChange(date: any, dateString: any) {
    if (date.length == 0) {
      this.params = {
        ...this.params,
        startTime: null,
        endTime: null,
        page: 1
      };
    } else {
      Object.assign(this.params, {
        startTime: this.formatTime(new Date(date[0]), "00:00:00"),
        endTime: this.formatTime(new Date(date[1]), "23:59:59")
      });
      this.params = {
        ...this.params,
        page: 1
      };
    }
    console.log("datedate", this.params);

    this.getSummaryList(this.params);
  }
  // 分页器
  onPageChange(data: any) {
    this.page = data.current;
    this.params.page = this.page;
    this.paginationConfig.current = this.page;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.getSummaryList(this.params);
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
/deep/.ant-select {
  margin-right: 16px;
  &:last-child {
    margin: 0;
  }
}
.databoard {
  text-align: left;
  background: rgba(240, 242, 245, 1);
  .everydayuse {
    background-color: #fff;
    @extend .pad;
    .selection {
      margin-top: 16px;
      height: 32px;
      margin-bottom: 24px;
      @extend .flexs;
      .select {
        @extend .flexs;
      }
    }
  }
}
</style>
