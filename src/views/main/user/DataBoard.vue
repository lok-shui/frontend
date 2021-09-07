<template>
  <div class="databoard">
    <div v-if="showempty" class="showempty">
      <EmptyStyle />
    </div>
    <div v-if="UseEmpty" class="UseEmpty">
      <UseEmpty />
    </div>
    <div class="service" v-show="showservicelist">
      <div class="serviceheader">
        <b class="title">服务调用累计</b>
        <div v-show="showbtn">
          <button
            :class="[
              { btnleft: true },
              { color: isshow <= servicelistlen && isshow !== 1 }
            ]"
            @click="leftbtn"
            :disabled="isshow < 2"
          >
            <a-icon type="left" />
          </button>
          <button
            :class="[
              { btnright: true },
              { color: servicelistlen > 1 && isshow !== servicelistlen }
            ]"
            @click="rightbtn"
            :disabled="isshow == servicelistlen"
          >
            <a-icon type="right" />
          </button>
        </div>
      </div>
      <div class="servicelist">
        <a-carousel
          ref="carousel"
          :dots="false"
          :class="servicelistlen > 1 ? 'carousel' : ''"
        >
          <div v-for="(i, k) in servicelistlen" :key="k">
            <div class="tabpane">
              <div
                class="list"
                v-for="(item, index) in servicelist"
                :key="index"
                v-show="index / 8 < k + 1 && k <= index / 8"
              >
                <div class="listbox">
                  <div class="listtext">
                    <div>{{ item.serviceName }}</div>
                    <div v-if="item.unit == '小时'">
                      <span class="usetimes" v-show="item.count.h !== 0">{{
                        item.count.h
                      }}</span>
                      <span v-show="item.count.h !== 0">小时</span>
                      <span
                        class="usetimes"
                        v-show="
                          item.count.h >= 9999
                            ? false
                            : item.count.minute == 0 && item.count.h == 0
                            ? false
                            : true
                        "
                        >{{ item.count.minute }}</span
                      >
                      <span
                        v-show="
                          item.count.h >= 9999
                            ? false
                            : item.count.minute == 0 && item.count.h == 0
                            ? false
                            : true
                        "
                        >分</span
                      >
                      <span class="usetimes" v-show="item.count.h < 999">{{
                        item.count.second
                      }}</span>
                      <span v-show="item.count.h < 999">秒</span>
                    </div>
                    <div v-else>
                      <span class="usetimes">{{ item.count }}</span>
                      <span>{{ item.unit }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-carousel>
      </div>
    </div>
    <div class="statistic" v-show="showservicelist" ref="statistic">
      <b class="title">服务使用统计</b>
      <div class="statisticform">
        <div class="select">
          <a-select
            style="width: 180px"
            @change="changeAppuse"
            :value="echartappname"
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
            style="width: 180px"
            @change="changeServiceId"
            :value="echartapiname"
            :disabled="apiselection.length < 2"
          >
            <a-select-option
              allowClear
              :value="item.serviceId + ',' + item.useMethod + ',' + item.name"
              v-for="(item, index) in apiselection"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select
            style="width: 180px"
            @change="changebillingType"
            :value="echartbillingType"
            :disabled="billingdisabled"
          >
            <!-- <a-select-option
              :value="item.id + ',' + item.unit + ',' + item.type"
              v-for="(item, index) in billingType"
              :key="index"
              v-show="item.id !== 'BY_QPS'"
              :disabled="item.id == 'BY_QPS'"
            >
              {{ item.id == "BY_QPS" ? "" : item.type }}
            </a-select-option> -->
            <a-select-option
              :value="item.id + ',' + item.unit + ',' + item.type"
              v-for="(item, index) in billingType"
              :key="index"
            >
              {{ item.type }}
            </a-select-option>
          </a-select>
        </div>
        <div class="statisticdata">
          <div class="day">
            <span
              v-for="(item, key) in xdate"
              :key="key"
              @click="changeEchartTime(item.datenum)"
              :class="datenum == item.datenum ? 'daycolor' : ''"
              >{{ item.datename }}</span
            >
          </div>
          <div>
            <RangePicker @dateChange="changedatenum" />
          </div>
        </div>
      </div>
      <div class="myeacharts" ref="myChart" style="width: 100%"></div>
    </div>
    <div class="everydayuse" v-show="showservicelist">
      <b class="title">每天使用汇总</b>
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
        <div class="detail hoverStyle" @click="lookall">全部明细</div>
      </div>
      <div class="table">
        <a-table
          rowKey="id"
          :columns="everydaycolumns"
          :data-source="everydaydata"
          :pagination="false"
          @change="onPageChange"
        >
          <template slot="cost" slot-scope="cost, recode">
            <span>{{
              recode.billingType == "按时计费" ? cost : cost + recode.unit
            }}</span>
          </template>
          <span slot="action" slot-scope="recode">
            <a @click="topath(recode)" class="hoverStyle">查看明细</a>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import moment from "moment";
import cache from "@/utils/cache";
import UserService from "@/service/user";
import {
  useTime,
  timeStamp,
  serviceusenum,
  serviceusetime
} from "@/utils/timeFormat";
import RangePicker from "@/views/main/user/components/RangePicker.vue"; // 日期组件
import EmptyStyle from "@/views/main/user/components/EmptyStyle.vue";
import UseEmpty from "@/views/main/user/components/UseEmpty.vue";
import echarts from "echarts";

const userService = UserService.getUserService();

@Component({
  components: {
    RangePicker,
    EmptyStyle,
    UseEmpty
  }
})
export default class UService extends Vue {
  // 累计调用服务数据
  servicelist: Array<any> = [];
  showempty: boolean = false;
  UseEmpty: boolean = false;
  showservicelist: boolean = false;
  tabkey: number = 1;
  // 服务使用选择器数据
  appselection: Array<any> = [];
  defaultappname: string = "";
  apiselection: Array<any> = [];
  defaultapiname: string = "";
  billingType: Array<any> = [];
  // 按钮显示
  showbtn: boolean = false;
  isshow: number = 1;
  servicelistlen: number = 2;
  // 表格数据
  everydaycolumns = [
    {
      title: "序列",
      customRender: (text: any, record: any, index: any) => `${index + 1}`,
      width: "10%"
    },
    {
      title: "时间",
      dataIndex: "date",
      width: "10%"
    },
    {
      title: "APP ID",
      dataIndex: "appId",
      width: "20%"
    },
    {
      title: "使用方式",
      dataIndex: "useMethod",
      width: "10%"
    },
    {
      title: "服务名称",
      dataIndex: "serviceName",
      width: "20%"
    },
    {
      title: "使用数量",
      dataIndex: "cost",
      scopedSlots: { customRender: "cost" },
      width: "20%"
    },
    {
      title: "操作",
      key: "action",
      scopedSlots: { customRender: "action" },
      width: "10%"
    }
  ];
  everydaydata: Array<any> = [];
  // myChart x轴数据

  xdate: Array<any> = [
    { datename: "近7天", datenum: -7 },
    { datename: "近30天", datenum: -30 },
    { datename: "近90天", datenum: -90 }
  ];
  datenum: any = "";
  // myChart数据
  echartappname: string = "";
  echartapiname: string = "";
  echartbillingType: string = "按量计费";
  billingdisabled: boolean = false;
  myChart: any;
  options: any = {
    title: {
      show: false,
      text: "暂无数据",
      left: "center",
      top: "center",
      textStyle: {
        color: "rgba(0,0,0,0.1)",
        fontWeight: "normal",
        fontSize: 58
      }
    },
    tooltip: {
      show: true,
      trigger: "axis"
    },
    legend: {
      data: [],
      right: "3%"
    },
    grid: {
      right: "4%",
      left: "2%",
      bottom: "5%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 45, //倾斜度 -90 至 90 默认为0
        margin: 40,
        align: "center"
        // width: 100,
      },
      axisTick: {
        alignWithLabel: true,
        inside: false
      },
      axisLine: {
        lineStyle: {
          color: "background:rgba(233,233,233,1)"
        }
      }
    },
    yAxis: {
      type: "value",
      name: "次数",
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    dataZoom: [
      {
        type: "slider",
        start: 10,
        end: 90,
        textStyle: {
          overflow: "truncate"
        }
      },
      {
        start: 1,
        end: 10,
        handleIcon:
          "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        handleStyle: {
          color: "#fff",
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }
    ],
    series: []
  };
  carousel: any = {};
  page: number = 1;
  pagesize: number = 20;
  totalCount: number = 0;
  params: any = {
    page: this.page,
    per_page: this.pagesize,
    sortBy: "date",
    order: "desc",
    type: 1
  };
  useId: any = "";
  paginationConfig!: pageconfig;
  echartParams: any = {
    statisticalPattern: "BY_NUMBER",
    serviceId: null,
    appId: null,
    useMethod: null
  };

  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.useId = cache.localGet("ai-front-id");
    this.getSystemService(this.useId);
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
  }
  mounted() {
    this.resizemyChart();
    this.carousel = this.$refs.carousel;
    console.log("555", this.carousel);
  }
  @Watch("options", { deep: true })
  // 选择器数据选择
  handleChangeoptions() {
    this.myChart.clear();
    this.myChart.setOption(this.options, true);
  }

  // 查看详情
  topath(recode: any) {
    this.$router.push(
      "databoard/" +
        recode.date +
        "/" +
        recode.serviceId +
        "/" +
        recode.useMethod +
        "/" +
        recode.billingType +
        "/" +
        recode.appId
    );
  }
  // 获取echart看板数据
  async getChartList(params: any) {
    console.log("echartParams", params);
    const res: any = await userService.getChartList(this.useId, params);
    if (res) {
      console.log("echart数据看板", res);
      if (res.series.length == 0) {
        this.options.series = res.series;
        this.options.title.show = true;
        console.log(2323232);
      } else {
        this.options.title.show = false;
        let data: Array<any> = res.series;
        data.map(item => {
          item["type"] = "line";
          if (this.options.yAxis.name == "小时") {
            for (let i = 0; i < item.data.length; i++) {
              item.data[i] = (item.data[i] / 3600).toFixed(2);
            }
          }
        });
        console.log("data", data);

        this.options.series = data;
      }
      this.options.legend.data = res.legend;
      this.options.xAxis.data = res.xAxisDate;
      this.options.xAxis.axisLabel.interval =
        this.datenum >= -7
          ? 0
          : this.datenum >= -30 && this.datenum <= -7
          ? 4
          : this.datenum <= -90 && this.datenum <= -30
          ? 14
          : this.datenum <= -300 && this.datenum <= -90
          ? 30
          : 19;
      console.log("this.options", this.options);
    }
  }
  // 改变时间获取echart数据
  changeEchartTime(day: any) {
    this.datenum = day;
    const times: any = {};
    Object.assign(times, {
      startTime: this.formatTime(new Date(timeStamp(day)), "00:00:00"),
      endTime: this.formatTime(new Date(), "23:59:59")
    });
    this.echartParams = {
      ...this.echartParams,
      ...times
    };
    this.getChartList(this.echartParams);
  }
  // eachart图表渲染
  resizemyChart() {
    // 初始化图表宽度
    const myChart: any = this.$refs.myChart;
    myChart.style.width = window.innerWidth - 290 + "px";
    this.myChart = echarts.init(myChart, "light");
    this.myChart.setOption(this.options, true);
    // echart宽度自适应
    window.addEventListener("resize", () => {
      myChart.style.width = window.innerWidth - 290 + "px";
      this.myChart.resize();
    });
    this.myChart.resize();
  }
  changeAppuse(val: any) {
    if (val == undefined) {
      this.echartParams = {
        ...this.echartParams,
        appId: null
      };
      this.echartappname = "全部应用";
    } else {
      this.echartParams = {
        ...this.echartParams,
        appId: val
      };
      this.echartappname = val;
    }
    this.getChartList(this.echartParams);
  }
  changeServiceId(val: any) {
    console.log(val);
    let arr = val.split(",");
    if (arr[0] == "null") {
      console.log("333", arr[1] == null);

      this.echartParams = {
        ...this.echartParams,
        serviceId: null,
        useMethod: arr[1] == "null" ? null : arr[1]
      };
      this.echartapiname = arr[2];
      console.log(" this.echartParams", this.echartParams);
    } else {
      this.echartParams = {
        ...this.echartParams,
        serviceId: arr[0],
        useMethod: arr[1]
      };
      this.echartapiname = val;
    }
    if (arr[1] == "APK" || arr[1] == "PRIVATIZATION_DEPLOYMENT") {
      this.echartbillingType = "设备授权数";
      this.billingdisabled = true;
      this.echartParams = {
        ...this.echartParams,
        statisticalPattern: "BY_EQUIPMENT"
      };
    } else {
      this.billingdisabled = false;
    }
    console.log("121", this.echartParams);
    this.getChartList(this.echartParams);
  }
  changebillingType(val: any) {
    console.log(val);
    let arr = val.split(",");
    this.options.yAxis.name = arr[1] == "秒" ? "小时" : arr[1];
    this.echartParams = {
      ...this.echartParams,
      statisticalPattern: arr[0]
    };
    this.echartbillingType = arr[2];
    this.getChartList(this.echartParams);
  }
  // 切换时间段数据
  formatTime(date: any, time: string) {
    return +new Date(`${moment(date).format("YYYY-MM-DD")} ${time}`);
  }
  changedatenum(date: any) {
    if (date.length == 0) {
      this.changeEchartTime(-7);
      this.datenum = -7;
    } else {
      let date1 = this.formatTime(new Date(date[0]), "00:00:00");
      let date2 = this.formatTime(new Date(date[1]), "23:59:59");
      let diff = Math.floor((date1 - date2) / 1000 / 3600 / 24);
      this.datenum = diff;
      console.log("date", date1, date2, diff);
      Object.assign(this.echartParams, {
        startTime: this.formatTime(new Date(date[0]), "00:00:00"),
        endTime: this.formatTime(new Date(date[1]), "23:59:59")
      });
    }
    this.getChartList(this.echartParams);
    // this.getRecentDay(this.params);
  }
  // 获取服务调用累计
  async getSystemService(useId: any) {
    const res = await userService.getSystemService(useId);
    if (res) {
      console.log("res", res);
      if (res.count == 0) {
        this.showempty = true;
      } else {
        if (res.usage_services.length !== 0) {
          this.showservicelist = true;
          this.getConditionList(this.useId);
          this.getapplication(this.useId);
          this.getBillingType();
          this.getSummaryList(this.useId, this.params);
          this.changeEchartTime(-7);
        } else {
          this.UseEmpty = true;
          return;
        }
        this.servicelist = res.usage_services;

        this.servicelist.map(item => {
          if (item.unit == "次") {
            let arr = serviceusenum(item.count);
            console.log("12312", arr);
            item.unit = arr.unit;
            item.count = arr.account;
          } else if (item.unit == "小时") {
            item.count = serviceusetime(item.count);
            console.log(" item.count", item.count);
          }
        });
        this.servicelistlen = Math.ceil(res.usage_services.length / 8);

        if (this.servicelistlen > 1) {
          this.showbtn = true;
        }
      }
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
        this.echartappname = "全部应用";
      } else {
        this.defaultappname = res[0].appName;
        this.echartappname = res[0].appName;
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
        this.echartapiname = "全部服务";
      } else {
        this.defaultapiname = res[0].name;
        this.echartapiname = res[0].name;
      }
      this.apiselection = [...arr, ...res];
    }
  }
  // 获取下拉计费方式
  async getBillingType() {
    const res: Array<any> = await userService.getBillingType();
    if (res) {
      console.log("billingType", res);
      res.map(item => {
        if (item.type !== "包量计费") {
          this.billingType.push(item);
        }
      });
    }
  }
  // 获取每天使用
  async getSummaryList(userid: any, params: any) {
    const res = await userService.getSummaryList(userid, params);
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

  // 筛选功能
  changeapp(values: string) {
    console.log(values);
    if (values == undefined) {
      this.params = {
        ...this.params,
        appId: null
      };
      this.defaultappname = "全部应用";
    } else {
      this.params = {
        ...this.params,
        appId: values
      };
      this.defaultappname = values;
    }

    this.getSummaryList(this.useId, this.params);
  }
  ChangeSummaryList(values: string) {
    console.log(values);
    let arr = values.split(",");
    if (arr[0] == "null") {
      this.params = {
        ...this.params,
        serviceId: null,
        useMethod: arr[1] == "null" ? null : arr[1]
      };
      this.defaultapiname = arr[2];
    } else {
      this.params = {
        ...this.params,
        serviceId: arr[0],
        useMethod: arr[1]
      };
      this.defaultapiname = arr[2];
    }

    this.getSummaryList(this.useId, this.params);
  }
  // 日期选择
  onChange(date: any, dateString: any) {
    if (date.length == 0) {
      this.params = {
        ...this.params,
        startTime: null,
        endTime: null
      };
    } else {
      Object.assign(this.params, {
        startTime: this.formatTime(new Date(date[0]), "00:00:00"),
        endTime: this.formatTime(new Date(date[1]), "23:59:59")
      });
      console.log("this.params", this.params);
    }
    this.getSummaryList(this.useId, this.params);
  }
  // 分页器
  onPageChange(data: any) {
    this.page = data.current;
    this.params.page = this.page;
    this.paginationConfig.current = this.page;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.getSummaryList(this.useId, this.params);
  }
  // 左右按钮切换
  leftbtn() {
    if (this.isshow == 1) return;
    this.isshow--;
    this.carousel.prev();
  }
  rightbtn() {
    if (this.servicelistlen == 1 || this.isshow == this.servicelistlen) return;
    this.isshow++;
    this.carousel.next();
  }
  // 查看全部
  lookall() {
    this.$router.push("databoarddetail");
  }
  handleChange() {}
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
.databoard {
  background-color: rgba(240, 242, 245, 1);
  text-align: left;
  min-height: 100%;
  position: relative;
  .showempty,
  .UseEmpty {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .service {
    @extend .pad;
    padding-right: 20px;
    padding-left: 20px;
    .serviceheader {
      @extend .flexs;
      padding-right: 12px;
      padding-left: 12px;
      .btn {
        // width: 23px;
        height: 32px;
        line-height: 32px;
        padding: 0 4px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(232, 232, 232, 1);
        color: rgba(0, 0, 0, 0.25);
        z-index: 1;
      }
      .btnleft {
        @extend .btn;
        margin-right: 12px;
      }
      .btnright {
        @extend .btn;
      }
      .color {
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
      }
    }
    .servicelist {
      width: 100%;
      .tabpane {
        display: flex;
        flex-wrap: wrap;
        .list {
          width: 25%;
          padding: 12px;
          .listbox {
            text-align: left;
            height: 110px;
            padding: 24px;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 1);
            border-radius: 4px;
            border: 1px solid rgba(232, 232, 232, 1);
            .usetimes {
              margin-top: 10px;
              font-size: 30px;
              font-weight: 400;
              line-height: 38px;
            }
          }
        }
      }
    }
  }
  /deep/.ant-select {
    margin-right: 16px;
    &:last-child {
      margin: 0;
    }
  }
  .statistic {
    width: 100%;
    background-color: #fff;
    @extend .pad;
    .statisticform {
      margin-top: 16px;
      height: 32px;
      @extend .flexs;

      .statisticdata {
        @extend .flexs;
        .day {
          width: 188px;
          height: 32px;
          background: rgba(255, 255, 255, 1);
          border-radius: 2px;
          @extend .flexs;
          padding-right: 12px;
          box-sizing: border-box;
          cursor: pointer;
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 20px;
            &:hover {
              color: rgba(24, 144, 255, 1);
            }
          }
          .daycolor {
            color: rgba(24, 144, 255, 1);
          }
        }
      }
    }
    .myeacharts {
      height: 400px;
      margin-top: 40px;
    }
  }
  .everydayuse {
    background-color: #fff;
    margin-bottom: 0;
    @extend .pad;
    .selection {
      margin-top: 16px;
      height: 32px;
      margin-bottom: 24px;
      @extend .flexs;
      .select {
        @extend .flexs;
      }
      .detail {
        padding: 5px 16px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(0, 0, 0, 0.15);
      }
    }
  }
  .carousel {
    height: 260px;
    /deep/.slick-track {
      height: 260px;
    }
  }
}
</style>
