<template>
  <div class="bgColor">
    <div class="fieldtype">
      <div class="header">
        <b class="title">分类器管理</b>
        <a-button type="danger" @click="createfierList">{{
          "+  " + (data.length == 0 ? "创建分类器" : "创建模板")
        }}</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="data"
        :class="data.length == 0 ? 'nodata' : ''"
      >
        <template slot="status" slot-scope="status">
          <a-tooltip placement="right">
            <template slot="title">
              <span>预计01月28日20：30前完成请刷新页面查看</span>
            </template>
            <span
              :class="[
                {
                  statusBlue: status == '2'
                },
                {
                  statusBlack: status == '0'
                },
                { statusGreen: status == '1' }
              ]"
              >{{ status == 0 ? "未训练" : status == 1 ? "训练中" : "训练完成"
              }}<a-icon
                :class="status == 1 ? 'statusIcon' : ''"
                :type="status == 1 ? 'info-circle' : 'none'"
            /></span>
          </a-tooltip>
        </template>
        <template slot="accuracy" slot-scope="accuracy">
          <span>{{ accuracy + "%" }}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <span
            :class="record.status == 0 || record.status == 1 ? 'none' : 'btn'"
            @click="trialTem(record)"
            >测试</span
          >
          <a-divider type="vertical" />
          <span
            :class="record.status == 1 ? 'none' : 'btn'"
            @click="toEdit(record._id)"
            >编辑</span
          >
          <a-divider type="vertical" />
          <span class="btn" @click="detele(record._id)">删除</span>
          <a-divider type="vertical" />
          <span
            :class="record.status == 0 || record.status == 1 ? 'none' : 'btn'"
            @click="release"
            >发布</span
          >
        </span>
      </a-table>
      <a-empty
        v-show="data.length == 0"
        class="empty"
        image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
        :image-style="{
          height: '200px'
        }"
      >
        <span slot="description"></span>
        <a-button type="primary" @click="createfierList"
          >+ 创建分类器
        </a-button>
      </a-empty>
    </div>
    <a-modal
      title="创建分类器"
      :visible="showmodal"
      :confirm-loading="confirmLoading"
      width="560px"
      :maskClosable="false"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form :form="form" @submit="handleSubmit" layout="horizontal">
        <a-form-item label="分类器名称">
          <a-input
            style="height: 32px; width: 405px"
            v-decorator="[
              'name',
              {
                rules: [
                  { required: true, message: '请输入字段类型名称，最长20个字' }
                ]
              }
            ]"
            placeholder="请输入字段类型名称，最长20个字"
            :maxLength="20"
          />
        </a-form-item>
        <a-form-item label="功能描述">
          <a-textarea
            style="height: 74px; width: 405px; resize: none"
            v-decorator="[
              'content',
              {
                rules: [
                  {
                    required: true,
                    message: '请填写描述内容'
                  }
                ]
              }
            ]"
            placeholder="请简要描述产品功能，最长200个字"
            :maxLength="200"
          />
        </a-form-item>
        <a-form-item class="button">
          <a-button @click="handleCancel" class="mr"> 取消 </a-button>
          <a-button type="primary" html-type="submit"> 确定 </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :title="actionTitle"
      :visible="actionvisible"
      :confirm-loading="confirmLoading"
      @ok="actionhandle"
      @cancel="actionCancel"
    >
      <p>{{ actionText }}</p>
    </a-modal>
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
            <div class="toChoose flexCen" @click="tryAgain">重新选择</div>
          </div>
        </div>
        <div class="rightResult">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1">
              <span slot="tab"><b>文本结果</b></span>
              <div class="nullTxt flexComCen" v-if="trialData.length == 0">
                <div class="nullImg">
                  <img src="@/assets/images/v3/empty_icon@2x.png" alt="" />
                </div>
                <div>识别结果区</div>
              </div>
              <a-spin :spinning="trialLoading" tip="识别中...">
                <div class="jsonBox" v-if="trialData.length !== 0">
                  <div class="title">
                    <span class="titleleft">字段名称</span>
                    <span>内容</span>
                  </div>
                  <div
                    v-for="(item, index) in trialData"
                    :key="index"
                    class="line flex"
                  >
                    <div class="name">{{ item.name }}</div>
                    <div class="cont">{{ item.content }}</div>
                  </div>
                </div>
                <!-- 错误提示 -->
                <div v-if="trialErrorTip">
                  <div class="flex">
                    <div class="redCircle">&times;</div>
                    错误信息
                  </div>
                  <div class="errorTip">请确保您的图片属于已有分类</div>
                </div>
              </a-spin>
            </a-tab-pane>

            <a-tab-pane key="3">
              <span slot="tab"><b>Json</b></span>
              <div class="jsonBox">
                <pre>{{ trialResponse }}</pre>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from "vue-property-decorator";
import OCRService from "@/service/ocrTem";
import fileConversion from "@/utils/fileConversion";
import cache from "@/utils/cache";
import { cloneDeep } from "lodash";
const getOCRService = OCRService.getOCRService();
const ocrService = OCRService.getOCRService();
@Component
export default class classifierList extends Vue {
  showmodal: boolean = false;
  confirmLoading: boolean = false;
  form: any = "";
  columns: any = [
    {
      title: "分类器名称",
      dataIndex: "name"
    },
    {
      title: "分类器 ID",
      dataIndex: "_id"
    },
    {
      title: "训练状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "发布时间",
      dataIndex: "createTime"
    },
    {
      title: "包含模板数量",
      dataIndex: "templateCount"
    },
    {
      title: "预告准确率",
      dataIndex: "accuracy"
    },
    {
      title: "操作",
      dataIndex: "action",
      scopedSlots: { customRender: "action" }
    }
  ];
  data: any = [];
  parmesdata: any = {
    page: 1,
    per_page: "10"
  };
  showOkBAtn: boolean = false;
  formMothed: any = {};
  actionTitle: string = "";
  actionText: string = "";
  actionvisible: boolean = false;
  operation: string = "";
  classifierId: string = "";
  // 试一试
  trialVisible: boolean = false;
  trialPreviewImage: string = "";
  trialData: any = [];
  trialResponse: any = {};
  trialLoading: boolean = false;
  trialErrorTip: boolean = false;
  // 上传图片
  imgList: any = [];
  modalPreviewImage: string = "";
  uploadParams: any;
  responseId: any;
  itemId: string = "";
  created() {
    this.form = this.$form.createForm(this, {});
    this.getclassifierdList();
  }
  // 创建新的字段类型
  createfierList() {
    this.showmodal = true;
    console.log(this.showmodal);
  }
  // 获取列表
  async getclassifierdList() {
    const res = await getOCRService.getclassifierdList();
    if (res) {
      console.log("res", res);
      this.data = res;
    }
  }
  // 创建分类器
  async createdclassifierd(params: any) {
    const res = await getOCRService.createdclassifierd(params);
    if (res) {
      console.log("res", res);
      this.$message.success("创建成功");
      this.showmodal = false;
      this.getclassifierdList();
    }
  }
  // 删除分类器
  async deltemplateClass() {
    const res = await getOCRService.deltemplateClass(this.classifierId);
    if (res) {
      console.log("res", res);
      this.actionvisible = false;
      this.$message.success("删除成功");
      this.getclassifierdList();
    }
  }
  handleCancel() {
    this.showmodal = false;
  }
  // 确认创建
  handleSubmit(e: any) {
    console.log("eeee", e);
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log("values", values);
        let { name, content } = values;
        const data = {
          name: name,
          desc: content
        };
        this.createdclassifierd(data);
      }
    });
  }
  // 跳转到编辑页面
  toEdit(id: any) {
    this.$router.push("classifierEdit/" + id);
  }
  // 删除和发布
  release() {
    this.actionText = "确定要将该分类器发布上线吗？";
    this.actionTitle = "提示";
    this.actionvisible = true;
  }
  detele(id: any) {
    this.actionText = "删除正在使用的分类器，会导致您无法实现自动分类器功能。";
    this.actionTitle = "确定删除该分类器?";
    this.actionvisible = true;
    this.operation = "del";
    this.classifierId = id;
  }
  actionhandle() {
    if (this.operation == "del") {
      this.deltemplateClass();
    }
  }
  actionCancel() {
    this.actionvisible = false;
  }
  // "试一试"
  trialTem(row: any) {
    console.log("row", row);
    this.trialVisible = true;
    this.itemId = row._id;
  }
  // "试一试"接口
  async trialUploadImage(params: any) {
    if (cache.localGet("trialErrorCode") !== 200) {
      this.trialErrorTip = true;
    } else if (cache.localGet("trialErrorCode") == null) {
      this.trialErrorTip = false;
    }
    const response = await ocrService.testclassifierd(params);
    cache.localSet("trialErrorCode", 200);
    if (cache.localGet("trialErrorCode") == 200) {
      this.trialLoading = false;
      this.trialErrorTip = false;
      this.trialResponse = response;
      this.trialData = cloneDeep(response);
    }
  }
  // "试一试"重新选择
  tryAgain() {
    this.trialPreviewImage = "";
    this.trialData = [];
    this.trialResponse = {};
  }
  // "试一试"上传图片
  async uploadTemImage(file: any) {
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
        console.log("试一试图片宽度", img.width, img.height);
        this.trialPreviewImage = file.preview;
        const temForm = new FormData();
        temForm.append("photo", file.file);
        temForm.append("id", this.itemId);
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
}
</script>

<style lang="scss" scoped>
@import "./css/templateList.scss";
@import "./css/fieldListStyle.scss";
</style>
