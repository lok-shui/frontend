<template>
  <div class="manamgement">
    <div class="header">
      <b class="title">应用基本信息</b>
      <div>
        <a-button @click="topath" class="btn"> 编辑 </a-button>
        <!-- <a-button type="primary" v-show="showequipment">下载SDK</a-button> -->
      </div>
    </div>
    <div class="usenews">
      <div class="usenewslist">
        <div class="usetitle">应用名称</div>
        <b class="usenewsdata">{{ usenews.appName }}</b>
      </div>
      <div class="usenewslist">
        <div class="usetitle">APP ID</div>
        <b class="usenewsdata">{{ usenews.id }}</b>
      </div>
      <div class="usenewslist">
        <div class="usetitle">API KEY</div>
        <b class="usenewsdata" id="appkey">{{ usenews.apiKey }}</b>
        <div class="copy" @click="copykey(usenews.apiKey)">复制</div>
      </div>
      <div class="usenewslist">
        <div class="usetitle">状态</div>
        <b class="usenewsdata">{{ usenews.status }}</b>
      </div>
      <div class="usenewslist">
        <div class="usetitle">创建时间</div>
        <b class="usenewsdata">
          {{ usenews.createTime | formatDate("YYYY-MM-DD HH:mm") }}
        </b>
      </div>
    </div>
    <div class="usetable">
      <b class="title bottom">已接入服务列表</b>
      <a-table
        :data-source="datalist"
        :columns="usetable"
        :pagination="false"
        rowKey="id"
      >
        <template slot="serviceName" slot-scope="serviceName, recode">
          <span v-if="recode.website == undefined">{{ serviceName }}</span
          ><a :href="recode.website" v-else class="website">{{
            serviceName
          }}</a>
        </template>
        <template slot="serviceValidEndTime" slot-scope="serviceValidEndTime">
          <span v-if="typeof serviceValidEndTime == 'string'">{{
            serviceValidEndTime
          }}</span>
          <span v-else>{{
            serviceValidEndTime | formatDate("YYYY-MM-DD HH:mm")
          }}</span>
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
              { statusBlack: status == '未接入' }
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
    <div class="equipmenttable" v-if="showequipment" style="display: none">
      <div class="eqtitle title">
        <b>设备ID</b>
        <div class="eqmsg">（用于关联识别设备）</div>
      </div>

      <a-table
        :data-source="equipmentlist"
        :columns="equipmenttable"
        :pagination="false"
      >
      </a-table>
    </div>
    <div class="description">
      <b class="title bottom">应用描述</b>
      <div class="top newline">
        {{
          usenews.description == undefined ? "暂无描述" : usenews.description
        }}
      </div>
    </div>
    <div class="usernews">
      <b class="title">应用对接人</b>
      <div class="userlist">
        <div class="userli">姓名：{{ usenews.owner }}</div>
        <div>邮箱：{{ usenews.email }}</div>
      </div>
    </div>
    <!-- 弹出框 -->
    <a-modal :visible="visible" width="398px">
      <b style="font-size: 16px">API KEY</b>
      <p>已复制到剪切板</p>
      <button class="btn" @click="handleOk">我知道了</button>
    </a-modal>
    <modal
      :visible="massvisible"
      :imgSrc="imgSrc"
      :message="message"
      @changevisible="changevisible"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UserService from "@/service/user";
import modal from "@/views/main/user/components/modal.vue";
import { cloneDeep } from "lodash";
import cache from "@/utils/cache";
import { timeFormat } from "@/utils/timeFormat";
const userService = UserService.getUserService();

@Component({
  components: {
    modal
  }
})
export default class UserInfo extends Vue {
  // 应用表格
  usetable: any = [
    {
      title: "服务名称",
      dataIndex: "serviceName",
      scopedSlots: { customRender: "serviceName" },
      key: 1
    },
    {
      title: "接入方式",
      dataIndex: "useMethod",
      key: 2
    },
    {
      title: "计费方式",
      dataIndex: "billingType",
      key: 3
    },
    {
      title: "有效期",
      dataIndex: "serviceValidEndTime",
      scopedSlots: { customRender: "serviceValidEndTime" },
      key: 4
    },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "操作",
      dataIndex: "action",
      scopedSlots: { customRender: "action" }
    }
  ];
  // 应用基础信息
  usenews: any = {};
  // 应用表格数据
  datalist: Array<any> = [];
  // 设备id表格
  equipmenttable: any = [
    { title: "设备ID", dataIndex: "equipmenname", key: 1 }
  ];
  // 设备id表格数据
  equipmentlist: any = [
    { equipmenname: "暂无添加" },
    { equipmenname: "暂无添加" }
  ];
  appid: string = "";
  // 服务的状态样式
  statusStyle: string = "";
  // 展示SDK
  showequipment: Boolean = false;
  // 状态
  isend: any = "";
  // 确认续费升级
  massvisible: boolean = false;
  imgSrc: any = "";
  message: string = "";
  visible: boolean = false;
  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.appid = this.$route.params.id;
    this.getUsedetail();
  }
  // 管理获取应用详情信息
  async getUsedetail() {
    const response = await userService.getUsedetail(this.$route.params.id);
    if (response) {
      console.log("this.response", response);
      this.usenews = response;
      this.datalist = response.purchaseInfoList;
      console.log("服务列表", this.datalist);
      // 获取当前的 时间判断用户服务状态
      const currenttime = new Date().getTime();
      console.log("currenttime", currenttime);
      this.datalist.map(item => {
        if (item.useMethod == "SDK" && item.billingType == "设备授权数") {
          this.showequipment = true;
        }
        const token = cache.localGet("ai-front-token");
        const username = cache.localGet("username");
        let newtoken = window.btoa(token);
        if (item.website !== undefined) {
          item.website =
            item.website + "?token=" + newtoken + "&username=" + username;
        }
        // 状态和有效期管理
        const endtime = item.serviceValidEndTime;
        // 根据是否有到期时间判断是否激活服务
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
      // 设备id数据
      const eqidarr: Array<any> = response.equipmentList;
      if (eqidarr.length > 0) {
        this.equipmentlist = [];
        eqidarr.map(item => {
          this.equipmentlist.push({
            equipmenname: item.equipmentId
          });
        });
      } else {
        eqidarr.map(item => {
          this.equipmentlist.unshift({
            equipmenname: item
          });
        });
      }
    }
  }
  // 点击编辑跳转
  topath() {
    this.$router.push("/main/user/editor/" + this.appid);
  }
  // 点击复制appkey到剪贴板方法

  copykey(key: string) {
    let url = key;
    let oInput = document.createElement("input");
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    console.log(oInput.value);
    document.execCommand("Copy"); // 执行浏览器复制命令
    this.visible = true;
  }
  handleOk() {
    this.visible = false;
  }
  handleCancel() {
    this.visible = false;
  }
  // 服务操作
  operation(str: string, id: any) {
    if (str == "-") return;
    this.massvisible = true;
    this.message = "您可以通过提交工单来升级额度或续费";
    this.imgSrc = require("@/assets/jingao.png");
  }
  // 操作
  changevisible(show: boolean) {
    this.massvisible = show;
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
.manamgement {
  background-color: #fff;
  padding: 24px 32px;
  box-sizing: border-box;
  min-height: 100%;
  text-align: left;
  .top {
    margin-top: 20px;
  }
  .btn {
    margin-right: 16px;
  }
  .newline {
    word-wrap: break-word;
    word-break: break-all;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    margin-bottom: 28px;
  }
  .usenews {
    display: flex;
    justify-content: space-around;
    padding-bottom: 32px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(232, 232, 232, 1);
    margin-bottom: 40px;
    .usenewslist {
      width: 25%;
      height: 37px;
      margin-right: 24px;
      text-align: left;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      &:last-child {
        margin-right: 0;
        border-right: none;
      }

      position: relative;
      .usetitle {
        position: absolute;
        top: -10px;
        left: 0;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        // margin-bottom: 20px;
      }
      .usenewsdata {
        width: 80%;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
        position: absolute;
        bottom: -10px;
        left: 0;
        font-size: 20px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
      }
      .copy {
        position: absolute;
        bottom: -10px;
        right: 10px;
        cursor: pointer;
        color: red;
      }
    }
  }
  .usetable {
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .equipmenttable {
    margin-bottom: 40px;
    .eqtitle {
      display: flex;
      align-items: center;
      .eqmsg {
        font-weight: none;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
  .description {
    padding-bottom: 32px;
    border-bottom: 1px solid rgba(232, 232, 232, 1);
    margin-bottom: 40px;
  }
  .usernews {
    .userlist {
      display: flex;
      margin-top: 20px;
      .userli {
        margin-right: 30px;
      }
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
