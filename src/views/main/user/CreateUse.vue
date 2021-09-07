<template>
  <div class="createuse">
    <a-form
      id="components-form-demo-validate-other"
      :form="form"
      @submit="handleSubmit"
      layout="vertical"
    >
      <a-form-item label="应用名称">
        <a-input
          class="inputStyle"
          v-decorator="[
            'appName',
            {
              rules: [
                {
                  required: true,
                  message: '请填入应用名称'
                },
                {
                  min: 2,
                  max: 20,
                  message: '请输入应用名称，2-20字'
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '请勿输入空格'
                }
              ]
            }
          ]"
          :maxLength="20"
          placeholder="请输入应用名称，2-20字"
        >
        </a-input>
      </a-form-item>
      <a-form-item>
        <span slot="label" style="textalign: left"
          >选择服务&nbsp;
          <a-tooltip placement="right" overlayClassName="tooltip">
            <span slot="title">
              勾选下列已开通服务接口，使应用可以请求已勾选的接口服务。<br />注意接口开通后将无法取消，可以新增。详细使用说明与计费说明参考帮助文档。
            </span>
            <a-icon type="question-circle" style="color: rgba(0, 0, 0, 0.3)" />
          </a-tooltip>
        </span>
        <a-table
          :columns="servicetitle"
          :data-source="servicelist"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            columnTitle: '选择 ',
            getCheckboxProps: record => ({
              props: {
                disabled: record.ischoos == 1
              }
            })
          }"
          :pagination="paginationConfig"
          @change="onPageChange"
        >
          <template slot="account" slot-scope="account">
            <span>{{ account }}</span>
          </template>
          <template
            slot="serviceValidEndTime"
            slot-scope="serviceValidEndTime, record"
          >
            <span v-if="serviceValidEndTime == null">{{
              (serviceValidEndTime =
                record.useMethod == "私有化部署"
                  ? "长期"
                  : "激活后" + record.activeCount + "天")
            }}</span>
            <span v-else>{{
              serviceValidEndTime | formatDate("YYYY-MM-DD HH:mm")
            }}</span>
          </template>
        </a-table>
      </a-form-item>

      <a-form-item label="线上平台">
        <a-checkbox-group
          v-decorator="[
            'platform',
            {
              rules: [
                {
                  required: true,
                  message: '请选择上线平台'
                }
              ]
            }
          ]"
          style="width: 100%"
        >
          <a-checkbox v-for="(item, key) in platform" :key="key" :value="item">
            {{ item }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="设备ID" v-if="showequipment" style="display: none">
        <a-table
          :columns="IdColumns"
          :data-source="eqiddata"
          :pagination="false"
        >
          <template
            v-for="col in ['name']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                :placeholder="'请输入设备ID'"
                @change="e => advantageHandleChange(e.target.value, index, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a
                @click="saveBrief(index)"
                class="hoverStyle"
                style="marginright: 20px"
                >保存</a
              >
              <a @click="cancalBrief(index, row)" class="hoverStyle">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="editingKey !== ''"
                @click="editBrief(index, true)"
                class="hoverStyle"
                style="marginright: 20px"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteBrief(index)">
                <a :disabled="editingKey !== ''" class="hoverStyle">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <div class="adddata">
          <a-upload
            name="file"
            :beforeUpload="beforeUpload"
            :remove="removerexcel"
            :file-list="firstlist"
            @change="handleChange"
          >
            <a-button :loading="uploadLoad" class="btn" type="primary">
              批量导入
            </a-button>
          </a-upload>
          <a-button icon="plus" @click="addBrief" class="btn"> 添加 </a-button>
        </div>
      </a-form-item>

      <a-form-item label="应用描述">
        <a-textarea
          class="inputStyle"
          style="height: 120px"
          v-decorator="[
            'desc',
            {
              rules: [
                {
                  max: 200,
                  message: '描述内容不能超过200字'
                }
              ]
            }
          ]"
          placeholder="请简单描述该应用的特点，200字以内"
          :maxLength="200"
        >
        </a-textarea>
      </a-form-item>
      <a-form-item label="项目对接人">
        <a-input
          class="inputStyle"
          v-decorator="[
            'owner',
            {
              rules: [
                {
                  pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
                  message: '不能包含特殊字符'
                }
              ]
            }
          ]"
          placeholder="请输入项目对接人姓名"
        >
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          class="inputStyle"
          v-decorator="[
            'email',
            {
              rules: [
                {
                  pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
                  message: '邮箱格式不正确'
                },
                {
                  max: 50,
                  message: '邮箱不得超过50字符'
                }
              ]
            }
          ]"
          placeholder="请输入项目对接人邮箱"
        >
        </a-input>
      </a-form-item>
      <a-form-item class="adddata">
        <a-button
          type="primary"
          html-type="submit"
          class="btn"
          v-if="appid == undefined"
        >
          创建
        </a-button>
        <a-button type="primary" class="btn" v-else html-type="submit">
          确认修改
        </a-button>
        <a-button @click="cancel"> 取消 </a-button>
      </a-form-item>
      <!-- 弹出框 -->
      <Modal
        :visible="visible"
        :imgSrc="imgSrc"
        :message="message"
        @changevisible="changevisible"
        @createUseList="createUseList"
      />
    </a-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UserService from "@/service/user";
import { cloneDeep } from "lodash";
import cache from "@/utils/cache";
import { useTime, useNum } from "@/utils/timeFormat";
import Modal from "@/views/main/user/components/modal.vue";
const userService = UserService.getUserService();
interface eqid {
  name: string;
  editable?: boolean;
}
interface appdata {
  userId: any;
  appName: string;
  purchaseIds: string;
  owner: string;
  email: string;
  desc?: string;
  equipmentIds?: string;
}
@Component({
  components: {
    Modal
  }
})
export default class createuse extends Vue {
  // 获取用户id
  userid: string = cache.localGet("ai-front-id");
  form: any = "";
  // 设备ID数据
  IdColumns: any = [
    {
      title: "设备ID",
      dataIndex: "name",
      scopedSlots: { customRender: "name" },
      width: 240
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];

  // 线上平台选项
  platform: any = ["Android", "iOS", "Windows", "Linux", "HTML5", "小程序"];
  appid: any = "";
  // 弹出框数据
  visible: boolean = false;
  imgSrc: any = "";
  message: string = "";
  createprams: any = "";
  // 可选服务
  servicetitle: any = [
    {
      title: "服务名称",
      dataIndex: "serviceName"
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
      dataIndex: "accessType"
    },
    {
      title: "服务量",
      dataIndex: "account",
      scopedSlots: { customRender: "account" }
    },
    {
      title: "到期时间",
      dataIndex: "serviceValidEndTime",
      scopedSlots: { customRender: "serviceValidEndTime" }
    }
  ];
  servicelist: Array<any> = [];
  purchaseInfoList: Array<any> = [];
  selectedRowKeys: any[] = [];
  // 分页器
  page: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  paginationConfig!: pageconfig;
  servicelistAll: Array<any> = [];
  servicearr: Array<any> = [];
  serviceshow: Array<any> = [];
  selectedRow: Array<any> = [];
  uploadLoad: boolean = false;
  filelist: any = {};
  uploadFile: any = [];
  url: any = "";
  headers: any = {};
  exceldata: any = [];
  showequipment: boolean = false;
  formData: any = [];
  firstlist: Array<any> = [];
  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.getUsechoice();
    this.form = this.$form.createForm(this, { name: "validate_other" });
    this.appid = this.$route.params.id;
    this.paginationConfig = {
      // showQuickJumper: true,
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
  // 获取当前id的可选服务
  async getUsechoice() {
    const response: Array<any> = await userService.getUsechoic(this.userid);
    if (response) {
      if (this.appid == undefined) {
        response.map((item, index) => {
          // if (item.unit == "小时") {
          //   item.account = useTime(item.account);
          // } else if (item.unit == "次") {
          //   item.account = useNum(item.account);
          // } else {
          //   item.account = item.account + item.unit;
          // }
          if (item.unit == "次") {
            item.account = useNum(item.account);
          } else {
            item.account = item.account + item.unit;
          }
        });
        for (let k = 1; k <= Math.ceil(response.length / 5); k++) {
          const list: Array<any> = [];
          response.map((item, index) => {
            if (index >= (k - 1) * 5 && index < k * 5) {
              list.push(item);
            }
            this.serviceshow[k] = {
              servicearr: [],
              servicelist: list
            };
          });
        }
        this.servicelist = this.serviceshow[this.page].servicelist;
        this.totalCount = response.length;
        this.paginationConfig.total = this.totalCount;
        this.paginationConfig = JSON.parse(
          JSON.stringify(this.paginationConfig)
        );
        // this.servicelist = response;
      } else {
        this.servicelistAll = response;
        this.getUsedetail(this.appid);
      }
    }
  }
  // 校验成功后提交
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      let purchaseInfoList: Array<any> = [];
      this.serviceshow.map((item: any) => {
        // item.servicelist.map((i: any) => {
        //   purchaseInfoList.push(i.id);
        // });
        item.servicearr.map((i: any, index: any) => {
          purchaseInfoList.push(item.servicelist[i].id);
        });
      });
      // if (this.appid !== undefined) {
      //   purchaseInfoList = [...purchaseInfoList, this.purchaseInfoList];
      // }
      if (purchaseInfoList.length == 0) {
        this.$message.error("请选择开通的服务");
        return;
      }
      if (err) {
        return;
      } else {
        console.log("values", values);
        const eqId: Array<any> = [];
        this.eqiddata.map(item => {
          eqId.push(item.name);
        });
        const parms = {
          userId: this.userid,
          appName: values.appName,
          purchaseIds: String(purchaseInfoList),
          owner: values.owner,
          email: values.email,
          desc: values.desc,
          equipmentIds: eqId,
          onlinePlatform: String(values.platform)
        };
        this.createprams = parms;
        console.log("this.createprams", parms);
        if (this.appid == undefined) {
          this.visible = true;
          this.imgSrc = require("@/assets/jingao.png");
          this.message = "接口开通后将无法取消，可以新增";
        } else {
          this.changeUseList(this.appid, parms);
          // this.changeUseLists(this.appid, parms);
        }
      }
    });
  }
  changeUseList(appid: string, parms: any) {
    this.changeUseLists(appid, parms);
    // if (this.showequipment && this.formData.length !== 0) {
    //   this.uploadFilePort(appid, parms);
    // } else {
    //   this.changeUseLists(appid, parms);
    // }
  }
  // 提交创建应用
  async createUseList(parms: any) {
    const response = await userService.createUseList(this.createprams);
    if (response) {
      this.imgSrc = require("@/assets/success.png");
      this.message = "应用创建成功";
    }
  }
  // 确认修改应用数据
  async changeUseLists(appid: string, parms: any) {
    const response = await userService.changeUseList(appid, parms);
    if (response) {
      if (this.showequipment && this.formData.length !== 0) {
        this.uploadFilePort();
      } else {
        this.visible = true;
        this.imgSrc = require("@/assets/success.png");
        this.message = "应用编辑成功";
      }
    }
  }
  // 编辑修改设备ID表格
  eqiddata: eqid[] = [];
  columns: string = "";
  editingKey: string = "";
  cacheBrief: eqid[] = [];
  advantageHandleChange(value: string, key: number, column: "name") {
    const newData = [...this.eqiddata];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.eqiddata = newData;
    }
  }
  // 编辑表格
  editBrief(key: any, type: boolean) {
    console.log("key", key);
    const newData = [...this.eqiddata];
    // 当前行设为编辑
    const currentLine = newData[key];
    currentLine.editable = type;
    this.eqiddata = newData;
    console.log("this.eqiddata", this.eqiddata);
  }
  // 删除表格
  deleteBrief(index: number) {
    const newData = [...this.eqiddata];
    newData.splice(index, 1);
    this.eqiddata = newData;
    this.cacheBrief = cloneDeep(this.eqiddata);
  }
  // 保存表格
  saveBrief(index: number, type: boolean) {
    const newData = [...this.eqiddata];
    const currentLine = newData[index];
    if (currentLine.name == "") {
      this.$message.error("功能标题或者功能描述不能为空");
      return;
    }
    delete currentLine.editable;
    this.eqiddata = newData;
    this.cacheBrief = cloneDeep(this.eqiddata);
    this.editingKey = "";
  }
  // 取消保存和编辑
  cancalBrief(index: number, row: any) {
    const newData = [...this.eqiddata];
    const currentLine = newData[index];
    delete currentLine.editable;
    this.eqiddata = newData;
    this.editingKey = "";
    if (row.name == "") {
      this.eqiddata.splice(index, 1);
    } else {
      this.eqiddata = cloneDeep(this.cacheBrief);
    }
  }

  // 新增设备ID功能
  addBrief() {
    this.eqiddata.push({ name: "", editable: true });
  }
  // 获取应用数据
  async getUsedetail(appid: string) {
    const response = await userService.getUsedetail(appid);
    if (response) {
      let {
        appName,
        purchaseInfoList,
        owner,
        email,
        description,
        equipmentList,
        onlinePlatform
      } = response;
      // 初始化可选服务数据
      for (let i = 0; i < purchaseInfoList.length; i++) {
        purchaseInfoList[i].ischoos = 1;
        if (
          purchaseInfoList[i].useMethod == "SDK" &&
          purchaseInfoList[i].billingType == "设备授权数"
        ) {
          console.log("this.showequipment", this.showequipment);

          this.showequipment = true;
        }
        for (let j = 0; j < this.servicelistAll.length; j++) {
          if (purchaseInfoList[i].id == this.servicelistAll[j].id) {
            this.servicelistAll.splice(j, 1);
          } else {
            this.servicelistAll[j].ischoos = 0;
          }
        }
      }
      this.servicelistAll = [...purchaseInfoList, ...this.servicelistAll];
      this.servicelistAll.map(item => {
        // if (item.unit == "小时") {
        //   item.account = useTime(item.account);
        // } else if (item.unit == "次") {
        //   item.account = useNum(item.account);
        // } else {
        //   item.account = item.account + item.unit;
        // }
        if (item.unit == "次") {
          item.account = useNum(item.account);
        } else {
          item.account = item.account + item.unit;
        }
      });
      // 设置分页器
      this.totalCount = this.servicelistAll.length;
      this.paginationConfig.total = this.totalCount;
      this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
      // 动态选择服务
      const servicelistAll: Array<any> = [];
      for (let k = 1; k <= Math.ceil(this.servicelistAll.length / 5); k++) {
        const list: Array<any> = [];
        const arr: Array<any> = [];
        this.servicelistAll.forEach((item, i) => {
          if (i >= (k - 1) * 5 && i < k * 5) {
            list.push(item);
            if (item.ischoos == 1) {
              arr.push(i - (k - 1) * 5);
            }
          }
        });
        servicelistAll[k] = {
          servicearr: arr,
          servicelist: list
        };
      }
      console.log("servicelistAll", servicelistAll);
      this.servicelistAll = servicelistAll;
      this.serviceshow = servicelistAll;
      this.selectedRowKeys = this.servicelistAll[this.page].servicearr;
      this.servicelist = this.servicelistAll[this.page].servicelist;

      if (equipmentList) {
        const eqidarr: Array<any> = equipmentList;
        eqidarr.map(item => {
          this.eqiddata.push({
            name: item.equipmentId
          });
        });
      }
      this.form.setFieldsValue({
        appName,
        owner,
        email,
        desc: description,
        platform: onlinePlatform.split(",")
      });
    }
  }

  changevisible(visible: boolean) {
    this.visible = false;
  }
  // 表格服务选择
  onSelectChange(selectedRowKeys: any, selectedRows: any) {
    console.log("selectedRowKeys", selectedRowKeys);
    // this.selectedRow[this.page] = selectedRows;
    // console.log("selectedRow", this.selectedRow);
    // let selectlist: Array<any> = [];
    // this.selectedRow.map(item => {
    //   selectlist = [...selectlist, ...item];
    // });
    // let isselect = true;
    // selectlist.map((item, index) => {
    //   selectlist.map((i, k) => {
    //     if (item.serviceName == i.serviceName && index !== k) {
    //       if (
    //         (item.billingType == "按时计费" ||
    //           item.billingType == "按量计费") &&
    //         (i.billingType == "按量计费" || i.billingType == "按次计费") &&
    //         i.billingType !== item.billingType
    //       ) {
    //         this.$message.error("同种服务不能同时选择按时和按量计费方式");
    //         isselect = false;
    //       }
    //     }
    //   });
    // });
    // if (isselect) {
    //   this.serviceshow[this.page].servicearr = selectedRowKeys;
    // } else {
    //   return;
    // }
    // let issdk = false;
    this.serviceshow[this.page].servicearr = selectedRowKeys;
    // this.serviceshow.map((item) => {
    //   for (let i = 0; i < item.servicearr.length; i++) {
    //     if (
    //       item.servicelist[item.servicearr[i]].useMethod == "SDK" &&
    //       item.servicelist[item.servicearr[i]].billingType == "设备授权数"
    //     ) {
    //       issdk = true;
    //     }
    //   }
    // });
    // this.showequipment = issdk;
    this.selectedRowKeys = this.serviceshow[this.page].servicearr;
    console.log("  this.serviceshow", this.serviceshow);
  }
  // 分页器
  onPageChange(data: any) {
    console.log("data", data);
    this.page = data.current;
    this.paginationConfig.current = this.page;
    // if (this.appid == undefined) {
    //   this.getUsechoice();
    // } else {
    //   this.servicelist = this.serviceshow[this.page].servicelist;
    //   this.selectedRowKeys = this.serviceshow[this.page].servicearr;
    //   this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    // }
    this.servicelist = this.serviceshow[this.page].servicelist;
    this.selectedRowKeys = this.serviceshow[this.page].servicearr;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    if (!this.serviceshow[this.page]) {
      this.selectedRowKeys = [];
    } else {
      this.selectedRowKeys = this.serviceshow[this.page].servicearr;
    }
  }
  // 取消按钮
  cancel() {
    this.visible = true;
    this.imgSrc = require("@/assets/jingao.png");
    this.message = "确认取消吗";
  }
  // 设备ID批量导入
  beforeUpload(file: any, fileList: any) {
    console.log("file", file);
    console.log("fileList", fileList);
    if (!file) return;
    let result: any = "";
    const fileArray = file.name.split(".");
    const suffix = fileArray[fileArray.length - 1];
    if (!suffix) {
      result = false;
      return result;
    }
    const xlslist = ["xls", "xlsx"];
    result = xlslist.some(function(item) {
      return item === suffix;
    });
    if (!result) {
      this.$message.error("请选择xls，或者xlsx文件导入！");
      return;
    } else {
      console.log(2323232);
      this.formData = new FormData();
      this.formData.append("file", file);
      this.formData.append("appId", this.appid);
      console.log(12132132);
    }
    this.filelist = file;
    return false;
  }
  // 上传文件接口
  async uploadFilePort() {
    const response = await userService.uploadFilePort(this.formData);
    try {
      if (response) {
        // this.$message.success("批量导入成功");
        this.visible = true;
        this.imgSrc = require("@/assets/success.png");
        this.message = "应用编辑成功";
        // this.changeUseLists(appid, parms);
      } else {
        this.$message.warning("文件上传失败，请重新上传");
      }
    } catch (e) {
      this.$message.warning(e);
    }
  }
  removerexcel() {
    this.formData = [];
  }
  handleChange(info: any) {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.firstlist = fileList;
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
/deep/.ant-checkbox-group,
.ant-checkbox-wrapper {
  display: flex;
}
/deep/.ant-row {
  margin-left: 12px;
}
/deep/.ant-checkbox-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.ant-form-item-control {
  text-align: left;
}
/deep/.ant-form-item-label {
  margin-bottom: 16px;
}

/deep/.ant-form-item {
  margin-left: 0;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(232, 232, 232, 1);
  &:nth-last-child(-n + 4) {
    border-bottom: none;
    padding-bottom: 0;
  }
}
/deep/.ant-form-item-label {
  margin-bottom: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  line-height: 24px;
  height: 24px;
  label {
    font-size: 18px;
    &::after {
      content: "";
    }
  }
}
/deep/.ant-input {
  outline: none;
}

.createuse {
  background-color: #fff;
  padding: 24px 32px;
  box-sizing: border-box;
  min-height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
  }
  .adddata {
    display: flex;
    margin-top: 24px;
    .btn {
      margin-right: 20px;
    }
  }
  .inputStyle {
    width: 757px;
  }
  .purchaseIds {
    display: flex;
    .purchasename {
      margin-left: 10px;
    }
  }
}
</style>
