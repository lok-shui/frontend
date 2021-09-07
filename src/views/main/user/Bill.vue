<template>
  <div class="user-contain">
    <div class="bill-contain">
      <div class="flex center one">
        <div class="flex center total">
          <div class="titles">累计时长</div>
          <!-- <div class="sub-title">（单位：元）</div> -->
          <div class="icon" />
          <!-- <div class="statistics">{{ totalBill }}</div> -->
          <div class="statistics" v-if="totalBill !== 0">
            {{ secondsFormat(totalBill) }}
          </div>
          <div class="statistics" v-else>{{ totalBill }}</div>
        </div>
        <div class="chart-contain">
          <div class="flex center head">
            <div class="title">
              <b>使用趋势</b>
              <span class="rant">(单位：小时)</span>
            </div>
            <a-radio-group @change="onRadioChange" defaultValue="近12个月">
              <a-radio-button
                v-for="item in radioItems"
                :key="item"
                :value="item"
                >{{ item }}</a-radio-button
              >
            </a-radio-group>
          </div>
          <div class="chart" ref="myChart"></div>
        </div>
      </div>

      <div class="two">
        <div class="flex center head">
          <!-- <div class="title">账单汇总</div> -->
          <div class="title">每天使用汇总</div>
          <div>
            使用区间：<a-range-picker
              @change="onDateChange"
              :value="timeValue"
              format="YYYY-MM-DD HH:mm:ss"
            />
            <a-button type="primary" @click="submitBtn" class="searchBtn">
              搜索
            </a-button>
            <a-button type="default" @click="clearData">
              清除
            </a-button>
          </div>
        </div>
        <!-- <div class="sub-title">（单位：元）</div> -->
        <a-spin :spinning="tableLoading">
          <a-table
            :columns="columns"
            :dataSource="tableData"
            :pagination="paginationConfig"
            @change="onPageChange"
            rowKey="id"
          >
            <template slot="cost" slot-scope="cost">
              <span>{{ secondsFormat(cost) }}</span>
            </template>
            <template slot="date" slot-scope="date">
              <span>{{ date | formatDate("YYYY-MM-DD") }}</span>
            </template>
          </a-table>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import echarts from "echarts";
import UserService from "@/service/user";
import { timeFormat } from "@/utils/timeFormat";

const userService = UserService.getUserService();

@Component
export default class UserBill extends Vue {
  get userId() {
    return this.$store.state.user.id;
  }
  radioItems: any[] = ["近3个月", "近6个月", "近12个月"];
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  totalBill: number = 0;

  dateRange: any = []; // 时间范围
  dateFormat: string = "YYYY-MM-DD";
  tableLoading: boolean = true; // table的加载

  myChart: any; //#5B8FF9

  columns: any[] = [
    { title: "序号", dataIndex: "index" },
    { title: "服务名称", dataIndex: "service" },
    // { title: "费用", dataIndex: "cost" },
    { title: "时长", dataIndex: "cost", scopedSlots: { customRender: "cost" } },
    {
      title: "时间",
      dataIndex: "date",
      scopedSlots: { customRender: "date" }
    }
  ];
  tableData: any[] = []; // table列表的数据
  costData: any = []; // 纵坐标表示费用的值
  costYear: any = []; // 横坐标表示年的值

  paramOption: any = {};
  timeValue: any = null;

  created() {
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

    const param = {
      page: this.paginationConfig.current,
      per_page: this.paginationConfig.pageSize
    };
    if (this.$store.state.user.username !== null) {
      this.getTotal(this.userId, 12);
      this.getUserBill(param);
    }
  }
  @Watch("$store.state.user", { deep: true })
  handleChanges() {
    if (this.$store.state.user.username == null) {
      this.$router.push("/login");
    }
  }

  mounted() {
    this.paramOption.page = this.page;
    this.paramOption.per_page = this.pageSize;
    this.myChart = echarts.init(this.$refs.myChart);

    const options = {
      tooltip: {
        trigger: "axis"
      },

      grid: {
        left: "4%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: this.costYear
        }
      ],
      yAxis: [
        {
          type: "value",
          splitNumber: 5,
          minInterval: 24
          //  interval: 24
        }
      ],
      color: ["#74A0FA"],
      series: [
        {
          name: "使用时长",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: this.costData
        }
      ]
    };
    this.myChart.setOption(options);

    // this.$nextTick( () => {
    //   this.renderChart();
    // })
  }

  renderChart() {
    const options = {
      tooltip: {
        trigger: "axis"
      },
      grid: {
        top: "20px",
        left: "40px",
        right: 0,
        bottom: "30px"
      },
      xAxis: {
        type: "category",
        data: this.costYear
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        }
      },
      series: [
        {
          data: this.costData,
          type: "bar",
          barMaxWidth: "80px"
        }
      ],
      color: ["#5B8FF9"]
    };
    this.myChart.setOption(options);
    setTimeout(() => {
      this.myChart.resize();
    }, 10);
  }

  // 总费用对应的接口
  async getTotal(userId: any, month: any) {
    this.costYear = [];
    this.costData = [];
    // const response = await userService.getTotalBill(this.userId);
    const response = await userService.getTotalBill(userId, month);
    const costs = response.everyMonthCost;
    for (let c in costs) {
      // this.costData.push(costs[c].cost);
      // 转换为小时,保留一个小数
      this.costData.push((costs[c].cost / 3600).toFixed(1));
      this.costYear.push(costs[c].year + "年" + costs[c].month + "月");
    }

    this.myChart.setOption({
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: "4%",
        right: "4%",
        top: "6%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: this.costYear,
          axisLabel: {
            interval: 0,
            rotate: 36
          }
        }
      ],
      color: ["#74A0FA"],
      yAxis: [
        {
          type: "value",
          splitNumber: 5,
          minInterval: 24
          //  interval: 24
        }
      ],
      series: [
        {
          name: "使用时长",
          type: "line",
          data: this.costData
        }
      ]
    });

    if (response.total) {
      this.totalBill = response.total;
    } else {
      this.totalBill = 0;
    }
    // const formTime =  this.secondsFormat(response.total);
  }

  // 账单汇总table列表对应的接口
  async getUserBill(paramoption: any) {
    const params = {
      page: this.page,
      per_page: this.pageSize
    };
    Object.assign(params, {
      startTime: this.dateRange[0],
      endTime: this.dateRange[1]
    });

    const response = await userService.getUserBill(this.userId, params);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));

    this.tableData = response.data;
    let index = 1;
    this.tableData.forEach((item: any) => {
      Object.assign(item, { index: index });
      index++;
    });
    if (response.data) {
      this.tableLoading = false;
    }
  }

  onRadioChange(e: any) {
    const monthNum = e.target.value.replace(/[^\d]/g, "");
    this.getTotal(this.userId, monthNum);
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getUserBill(this.paramOption);
  }

  // 选择时间
  onDateChange(date: any, dateString: any) {
    this.timeValue = date;
    const st1 = new Date(dateString[0].replace(/-/g, "/"));
    const st = st1.getTime();
    const et1 = new Date(dateString[1].replace(/-/g, "/"));
    const et = et1.getTime();
    const ts = [st, et];
    // 深度克隆
    this.dateRange = JSON.parse(JSON.stringify(ts));
  }

  // 搜索
  submitBtn() {
    this.getUserBill(this.paramOption);
  }

  // 清除
  clearData() {
    this.dateRange = [];
    this.timeValue = null;
    this.paramOption = {
      page: 1,
      per_page: 10
    };
    this.paginationConfig.current = 1;
    this.getUserBill(this.paramOption);
  }

  // 转为时分秒
  secondsFormat(s: any) {
    return timeFormat(s);
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
// 隐藏日期的叉号
/deep/ .ant-calendar-picker-clear {
  display: none;
}
// '搜索'按钮的间距
/deep/.ant-btn-primary {
  margin: 0 15px;
}
.bill-contain {
  .one {
    height: 300px;

    .total {
      width: 230px;
      height: 300px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      flex-direction: column;

      .titles {
        line-height: 25px;
        font-size: 18px;
        font-weight: bold;
      }
      .sub-title {
        font-size: 12px;
        color: #808080;
        line-height: 18px;
        margin-bottom: 26px;
      }
      .icon {
        width: 42px;
        height: 42px;
        background-size: 100% 100%;
        background-image: url("../../../assets/images/time-circle.svg");
        margin: 35px auto 58px auto;
      }
      .statistics {
        font-size: 24px;
        color: #000;
        line-height: 33px;
        font-weight: bold;
      }
    }

    .chart-contain {
      // flex: 1;
      width: 778px;
      height: 300px;
      margin-left: 24px;

      .head {
        height: 40px;
        justify-content: space-between;

        .title {
          margin-bottom: 0;
          .rant {
            font-size: 12px;
            opacity: 0.6;
            margin-left: 5px;
          }
        }
      }

      .chart {
        width: 100%;
        height: 260px;
        position: relative;
      }
    }
  }

  .two {
    margin-top: 24px;
    padding-top: 24px;
    border-top: #e9e9e9 solid 1px;

    .head {
      height: 32px;
      justify-content: space-between;
      margin-bottom: 32px;
      .title {
        margin-bottom: 0;
      }
    }

    .sub-title {
      color: #808080;
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 15px;
    }
  }
}
</style>
