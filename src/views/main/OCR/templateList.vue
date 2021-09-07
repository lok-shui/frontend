<template>
  <div class="bgColor">
    <div class="ocrControl">
      <a-tabs type="card" @change="changeTab" :default-active-key="1">
        <!-- 预置模板 -->
        <a-tab-pane :key="2" tab="预置模板">
          <a-table :columns="columns" :dataSource="tableData" rowKey="id">
            <template slot="photo" slot-scope="photo">
              <div class="photoBox">
                <img :src="photo" alt="" />
              </div>
            </template>
            <template slot="status" slot-scope="status">
              <span :class="status == '0' ? 'defaultStatus' : 'greenStatus'">{{
                status == "0" ? "未发布" : "已发布"
              }}</span>
            </template>
            <template slot="operation" slot-scope="operation, row, index">
              <div class="flex">
                <div @click="checkJson(row, index)" class="checkJson">
                  查看JSON
                </div>
                <div @click="trialTem(row)">试一试</div>
              </div>
            </template>
          </a-table>
        </a-tab-pane>
        <!-- 自定义模板 -->
        <a-tab-pane :key="1" tab="自定义模板" v-if="showTab2 == true">
          <!-- 空页面 -->
          <div class="empityBox flexCom" v-if="customTable.length == 0">
            <div class="flex">
              <div class="itemCen">
                <div class="imgwh">
                  <img
                    src="@/assets/images/v3/empty_guidelines_1@2x.png"
                    alt=""
                  />
                </div>
                <div class="black">1.上传模板图片</div>
              </div>
              <div class="itemCen">
                <div class="imgwh">
                  <img
                    src="@/assets/images/v3/empty_guidelines_2@2x.png"
                    alt=""
                  />
                </div>
                <div>2.框选参照字段</div>
              </div>
              <div class="itemCen">
                <div class="imgwh">
                  <img
                    src="@/assets/images/v3/empty_guidelines_3@2x.png"
                    alt=""
                  />
                </div>
                <div>3.框选识别区</div>
              </div>
              <div class="itemCen">
                <div class="imgwh">
                  <img
                    src="@/assets/images/v3/empty_guidelines_4@2x.png"
                    alt=""
                  />
                </div>
                <div>4.试一试</div>
              </div>
              <div class="itemCen">
                <div class="imgwh">
                  <img
                    src="@/assets/images/v3/empty_guidelines_5@2x.png"
                    alt=""
                  />
                </div>
                <div>5.发布，调用API进行使用</div>
              </div>
            </div>
            <div class="empityBtn">
              <a-button @click="createTemplate"
                ><b>+</b>马上创建自定义模板</a-button
              >
            </div>
          </div>
          <!-- 列表 -->
          <a-table
            :columns="columns"
            :dataSource="customTable"
            rowKey="id"
            v-if="customTable.length !== 0"
          >
            <template slot="status" slot-scope="status">
              <span :class="status == '0' ? 'defaultStatus' : 'greenStatus'">{{
                status == "0" ? "未发布" : "已发布"
              }}</span>
            </template>
            <template slot="photo" slot-scope="photo">
              <div class="photoBox">
                <img :src="photo" alt="" />
              </div>
            </template>
            <template slot="operation" slot-scope="operation, row">
              <div class="flexBet">
                <div @click="editTem(row)" class="words">编辑</div>
                <a-popconfirm
                  class="words"
                  title="确定要删除吗？"
                  @confirm="() => delTem(row)"
                  >删除
                </a-popconfirm>
                <div
                  v-if="row.status == 1"
                  @click="trialTem(row)"
                  class="words"
                >
                  试一试
                </div>
                <div
                  v-if="row.status == 0"
                  @click="releaseRem(row)"
                  class="words"
                >
                  发布
                </div>
              </div>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>

      <div class="createBtn">
        <a-button @click="createTemplate"><b>+</b>创建模板</a-button>
      </div>
    </div>

    <div class="checkJsonStyle" v-show="jsonVisible">
      <div class="jsonTitle flexBet">
        <div>
          <b>示例Json</b>
          <a-button @click="copyText">{{ btnTxt }}</a-button>
        </div>
        <div class="more flexCen" @click="fadeJson">
          <a-icon type="double-right" />
        </div>
      </div>
      <div class="jsonContent">
        <pre>
          <textarea id="abc" readonly ref="copy"  v-model="jsonString" v-if="!showTextarea"></textarea>
          <div ref="copys" :id="rowId" v-if="showTextarea" v-text="jsonData"> </div>
         </pre>
      </div>
    </div>

    <!-- 试一试弹窗 -->
    <a-modal
      title="试一试"
      v-model="trialVisible"
      :maskClosable="false"
      class="trialModal"
      @cancel="tryAgain"
    >
      <div class="flexCen">
        <div class="leftUpload">
          <a-upload
            v-if="trialPreviewImage == ''"
            list-type="picture-card"
            :file-list="imgList"
            :customRequest="uploadTemImage"
          >
            <div class="flexCom">
              <div><img src="@/assets/images/v3/icon_unload.svg" alt="" /></div>
              <div class="middle">点击或将文件拖拽到这里上传</div>
              <div>图片大小不超过4m，最长边不超过2048px</div>
            </div>
          </a-upload>

          <div class="trialImgBox flexCen" v-if="trialPreviewImage !== ''">
            <img :src="trialPreviewImage" alt="" />
            <div class="toChoose flexCen">
              <a-upload :file-list="imgList" :customRequest="uploadTemImage">
                <div style="color:#fff;">重新选择</div>
              </a-upload>
            </div>
          </div>
        </div>
        <div class="rightResult">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1">
              <span slot="tab"><b>识别结果</b></span>
              <div class="nullTxt flexComCen" v-if="initShow">
                <div class="nullImg">
                  <img src="@/assets/images/v3/empty_icon@2x.png" alt="" />
                </div>
                <div>识别结果区</div>
              </div>
              <a-spin :spinning="trialLoading" tip="识别中...">
                <div class="jsonBox" v-if="trialData.length !== 0">
                  <div class="title flex">
                    <div class="leftText">字段名称</div>
                    <div class="rightText">内容</div>
                  </div>
                  <div
                    v-for="(item, index) in trialData"
                    :key="index"
                    class="line flexTop"
                  >
                    <div class="leftText">{{ item.name }}</div>
                    <div class="rightText">{{ item.content }}</div>
                  </div>
                </div>
                <!-- 错误提示 -->
                <div class="jsonBox" v-if="trialErrorTip">
                  <div class="flex">
                    <div class="redCircle">&times;</div>
                    <span class="redColor">错误信息</span>
                  </div>
                  <div class="errorTip">请确保您的图片属于已有分类</div>
                </div>
              </a-spin>
            </a-tab-pane>

            <a-tab-pane key="3">
              <span slot="tab"><b>Json</b></span>
              <div class="contorlJson">
                <div class="jsonBox">
                  <pre>{{ trialResponse }}</pre>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-modal>

    <!-- "创建模板"弹窗 -->
    <a-modal
      title="创建识别模板"
      v-model="createVisible"
      :maskClosable="false"
      class="createModal"
      @ok="confirmBtn"
      @cancel="toChooseBtn"
    >
      <a-form-model ref="ruleForm" :model="createForm" :rules="createRules">
        <a-form-model-item ref="name" label="模板名称" prop="name">
          <a-input
            ref="userNameInput"
            v-model="createForm.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
            placeholder="请输入模板名称"
            :maxLength="40"
          >
            <a-tooltip slot="suffix">
              <div>
                <a-icon
                  type="close-circle"
                  v-if="createForm.name !== ''"
                  @click="clearName"
                  class="clearIcon"
                />
              </div>
            </a-tooltip>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="模板照片：" required>
          <a-upload
            v-if="modalPreviewImage == ''"
            list-type="picture-card"
            :file-list="imgList"
            :customRequest="uploadCreateImage"
          >
            <div class="flexCom">
              <div><img src="@/assets/images/v3/icon_unload.svg" alt="" /></div>
              <div class="middle">点击或将文件拖拽到这里上传</div>
              <div>图片大小不超过4m，最长边不超过2048px</div>
            </div>
          </a-upload>
          <div class="createImgBox flexCen" v-if="modalPreviewImage !== ''">
            <img :src="modalPreviewImage" alt="" />
            <div class="toChoose flexCen">
              <a-upload :file-list="imgList" :customRequest="uploadCreateImage">
                <div style="color:#fff;">重新选择</div>
              </a-upload>
            </div>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- "提示"弹窗 -->
    <a-modal
      title="提示"
      v-model="promptVisible"
      :maskClosable="false"
      class="promptModal"
      @cancel="releaseCancel"
      @ok="releaseConfirm"
    >
      <div>{{ releaseErrorMessage }}</div>
    </a-modal>

    <!-- "要创建模板，先登录" 弹窗 -->
    <a-modal
      title="提示"
      v-model="loginVisible"
      :maskClosable="false"
      class="promptModal"
      okText="跳转至登录页"
      @ok="toLoginPage"
    >
      <div>
        请先登录，再创建模板。
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import OCRService from "@/service/ocrTem";
import cache from "@/utils/cache";
import fileConversion from "@/utils/fileConversion";
import { utcToLocalTime } from "@/utils/timeFormat";
import { fitImgSuffix } from "@/utils/publicJsEvent";

const ocrService = OCRService.getOCRService();

@Component({
  components: {}
})
export default class templateEdit extends Vue {
  tabIndex: number = 1;
  type: number = 1; // 预置模板参数
  showTab2: boolean = false;
  columns: Array<object> = [
    {
      title: "模板图片",
      dataIndex: "photo",
      scopedSlots: { customRender: "photo" }
    },
    { title: "模板名称", dataIndex: "name" },
    {
      title: "模板ID",
      dataIndex: "templateSign",
      scopedSlots: { customRender: "type" }
    },
    {
      title: "模板状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "发布时间",
      dataIndex: "releaseTime",
      scopedSlots: { customRender: "releaseTime" }
    },
    {
      title: "最近保存时间",
      dataIndex: "updateTime",
      scopedSlots: { customRender: "updateTime" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 300,
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: Array<object> = [];
  customTable: Array<object> = [];
  jsonVisible: boolean = false;
  jsonData: any = {};
  jsonString: string = "";
  itemId: string = "";
  showTextarea: boolean = true;
  btnTxt: string = "一键复制";

  // 创建模板
  createVisible: boolean = false;
  createForm: any = {
    name: ""
  };
  createRules: any = {
    name: [
      {
        required: true,
        message: "请输入名字",
        trigger: "blur"
      }
    ]
  };
  // 提示
  promptVisible: boolean = false;
  loginVisible: boolean = false;
  releaseParam: any = {};
  // 试一试
  trialVisible: boolean = false;
  trialPreviewImage: string = "";
  trialData: any = [];
  trialResponse: any = {};
  trialLoading: boolean = false;
  trialErrorTip: boolean = false;
  initShow: boolean = true;

  // 上传图片
  imgList: any = [];
  modalPreviewImage: string = "";
  uploadParams: any;
  responseId: any;

  // 错误提示语
  defaultMessage: string =
    "发布后您的修改将直接在线上生效，请确保上传图片试用符合预期后再进行发布，是否发布？";
  releaseErrorMessage: string = this.defaultMessage;
  rowId: string = "";

  copyArr: any[] = [];
  copyIndex: number = 0;
  copyId: string = "";

  create() {
    this.createForm = this.$form.createForm(this, {});
  }

  mounted() {
    // 用户如果没有登录就看不到自定义模板
    if (this.$store.state.user.username == null) {
      this.showTab2 = false;
    } else {
      this.showTab2 = true;
    }
    // type=1就是查询预置模板
    const params = {
      type: this.type
    };
    this.getTemplateList(params);
    this.getCustomData({});
  }

  // 预置模板数据
  async getTemplateList(type: any) {
    const response = await ocrService.getTemplateList(type);
    response.forEach((item: any, index: number) => {
      item.photo = `data:image/png;base64,${item.photo}`;
      item.releaseTime = utcToLocalTime(item.releaseTime);
      item.updateTime = utcToLocalTime(item.updateTime);
      this.copyArr.push("一键复制");
    });
    this.tableData = response;
  }
  // 自定义模板数据
  async getCustomData(type: any) {
    const response = await ocrService.getTemplateList(type);
    response.forEach((item: any, index: number) => {
      item.photo = `data:image/png;base64,${item.photo}`;
      if (item.releaseTime !== "未发布") {
        item.releaseTime = utcToLocalTime(item.releaseTime);
      }
      item.updateTime = utcToLocalTime(item.updateTime);
    });
    this.customTable = response;
  }

  // 切换tab
  changeTab(key: any) {
    this.tabIndex = key;
  }

  // 查看JSON
  checkJson(row: any, index: any) {
    this.jsonData = cloneDeep(row.view_json);
    this.copyIndex = index;
    this.jsonVisible = true;
    this.btnTxt = this.copyArr[this.copyIndex];
    this.showTextarea = true;
    this.rowId = row._id;
    this.copyId = row._id;
    if (JSON.stringify(this.jsonData) !== "{}") {
      setTimeout(() => {
        let pre: any = document.getElementById(
          this.rowId
        ) as HTMLTextAreaElement;
        if (pre !== undefined) {
          this.jsonString = pre.innerHTML;
          this.showTextarea = false;
        }
      }, 10);
    }
  }

  // 隐藏JSON
  fadeJson() {
    this.jsonVisible = false;
  }
  // 一键复制
  copyText() {
    // 判断是否为空对象
    if (JSON.stringify(this.jsonData) !== "{}") {
      const inputC = document.getElementById("abc") as HTMLTextAreaElement;
      inputC.select();
      document.execCommand("Copy");
      this.$message.success("已复制！");
      this.copyArr[this.copyIndex] = "已复制";
      this.btnTxt = this.copyArr[this.copyIndex];
      setTimeout(() => {
        this.btnTxt = "一键复制";
        this.copyArr[this.copyIndex] = "一键复制";
      }, 5000);
    }
  }

  // "编辑"
  editTem(row: any) {
    this.rowId = row._id;
    this.$router.push({
      path: "./templateEdit",
      query: {
        id: row._id
      }
    });
  }

  // "删除"
  delTem(row: any) {
    this.delTemplateItem(row._id);
  }
  async delTemplateItem(id: any) {
    const response = await ocrService.delTemplateItem(id);
    this.getCustomData({});
    if (response) {
      this.$message.success("删除成功!");
    }
  }

  // "发布"
  releaseRem(row: any) {
    this.promptVisible = true;
    const param = {
      _id: row._id,
      status: "1"
    };
    this.releaseParam = param;
  }
  // "发布"接口
  async releaseTemItem(params: any) {
    if (cache.localGet("releaseErrorCode") !== 200) {
      setTimeout(() => {
        this.releaseErrorMessage =
          cache.localGet("releaseErrorMessage") + `。\n\n` + `请编辑后发布`;
      }, 500);
    } else if (cache.localGet("releaseErrorCode") == null) {
      this.releaseErrorMessage = this.defaultMessage;
    }
    const response = await ocrService.releaseTemItem(params);
    cache.localSet("releaseErrorCode", 200);
    if (cache.localGet("releaseErrorCode") == 200) {
      cache.localSet("releaseErrorMessage", "");
      this.releaseErrorMessage = this.defaultMessage;
      this.getCustomData({});
      this.promptVisible = false;
      this.$message.success("发布成功！");
    } else {
      this.promptVisible = true;
    }
  }
  // "发布"确认
  releaseConfirm() {
    this.releaseTemItem(this.releaseParam);
  }
  // "发布" 取消
  releaseCancel() {
    this.releaseErrorMessage = this.defaultMessage;
  }

  // "试一试"
  trialTem(row: any) {
    this.trialVisible = true;
    this.itemId = row.templateSign;
  }
  // "试一试"上传图片
  async uploadTemImage(file: any) {
    this.trialErrorTip = false;
    this.initShow = true;

    if (fitImgSuffix(file.file.name, true)) {
      const errorMsg = fitImgSuffix(file.file.name, true);
      this.$message.error(`${errorMsg}`);
      return;
    }
    file.preview = await fileConversion.getBase64(file.file);
    const size = file.file.size / 1024 / 1024;
    const img = new Image();
    img.src = file.preview;
    img.onload = () => {
      if (img.width > 2048 || img.height > 2048) {
        this.$message.error("最长边不能超过2048px");
        return;
      } else if (size > 4) {
        this.$message.error("图片大小不能超过4M");
        return;
      } else {
        this.trialPreviewImage = file.preview;
        const temForm = new FormData();
        temForm.append("photo", file.file);
        temForm.append("templateSign", this.itemId);
        this.trialUploadImage(temForm);
        this.trialLoading = true;

        if (this.trialData.length !== 0) {
          this.trialLoading = false;
        } else {
          setTimeout(() => {
            this.trialLoading = false;
          }, 3000);
        }
      }
    };
  }
  // "试一试"接口
  async trialUploadImage(params: any) {
    setTimeout(() => {
      if (cache.localGet("trialErrorCode") !== 200) {
        this.trialErrorTip = true;
        this.trialLoading = false;
        this.initShow = false;
      } else if (cache.localGet("trialErrorCode") == null) {
        this.trialErrorTip = false;
        this.trialLoading = true;
        this.initShow = false;
      }
    }, 1000);
    const response = await ocrService.trialUploadImage(params);
    cache.localSet("trialErrorCode", 200);
    if (cache.localGet("trialErrorCode") == 200) {
      this.trialLoading = false;
      this.trialErrorTip = false;
      this.initShow = false;
      this.trialResponse = response;
      this.trialData = cloneDeep(response);
    }
  }
  // "试一试"取消
  tryAgain() {
    this.trialPreviewImage = "";
    this.trialData = [];
    this.trialResponse = {};
    this.trialErrorTip = false;
    this.initShow = true;
  }

  // '创建模板'
  createTemplate() {
    if (this.$store.state.user.username == null) {
      this.loginVisible = true;
      this.createVisible = false;
    } else {
      this.loginVisible = false;
      this.createVisible = true;
    }
  }
  // '创建模板'-upload
  async uploadCreateImage(file: any) {
    if (fitImgSuffix(file.file.name, true)) {
      const errorMsg = fitImgSuffix(file.file.name, true);
      this.$message.error(`${errorMsg}`);
      return;
    }
    file.preview = await fileConversion.getBase64(file.file);
    const size = file.file.size / 1024 / 1024;
    const img = new Image();
    img.src = file.preview;
    img.onload = () => {
      if (img.width > 2048 || img.height > 2048) {
        this.$message.error("最长边不能超过2048px");
        return;
      } else if (size > 4) {
        this.$message.error("图片大小不能超过4M");
        return;
      } else {
        this.modalPreviewImage = file.preview;
        this.createForm.name = file.file.name;
        this.uploadParams = new FormData();
        this.uploadParams.append("photo", file.file);
        this.imgList = [file.file];
      }
    };
  }
  // '创建模板'- upload
  async uploadImage(params: any) {
    const response = await ocrService.uploadImage(params);
    this.responseId = response._id;
    this.createVisible = false;
    this.$message.success("创建成功！");
    this.getCustomData({});
    this.$router.push({
      path: "./templateEdit",
      query: {
        id: this.responseId
      }
    });
    // this.promptVisible = true;
  }
  // '创建模板'- 确认
  confirmBtn() {
    if (this.imgList.length == 0) {
      this.$message.error("请上传文件！");
      return;
    } else if (this.createForm.name == "") {
      this.$message.error("请输入模板名称！");
      return;
    } else {
      this.uploadParams.append("name", this.createForm.name);
      this.uploadImage(this.uploadParams);
    }
  }
  // '创建模板'- 重新选择
  toChooseBtn() {
    this.modalPreviewImage = "";
    this.createForm.name = "";
    this.imgList = [];
  }
  // '创建模板'- 重新选择
  clearName() {
    this.createForm.name = "";
  }
  // '发布'的提示
  promptConfirm() {
    setTimeout(() => {
      this.createVisible = false;
      this.$router.push({
        path: "./templateEdit",
        query: {
          id: this.responseId
        }
      });
    }, 500);
    this.promptVisible = false;
  }
  // 跳到登录页
  toLoginPage() {
    // this.$router.push("/login");
    this.$router.push({
      path: "/login",
      query: {
        prePage: "templateList"
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "./css/templateList.scss";
</style>
