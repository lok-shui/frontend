<template>
  <div class="bgColor">
    <div class="fieldtype">
      <div class="header">
        <b class="title">我的字段类型</b>
        <a-button type="danger" @click="createfieldtype">
          + 创建字段类型
        </a-button>
      </div>
      <a-table
        :columns="fieldTypecolumns"
        :data-source="fieldTypeData"
        :pagination="paginationConfig"
        @change="onPageChange"
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
            @click="editorFieldList(record._id, record.name, record.content)"
            >编辑</span
          >
          <a-divider type="vertical" />
          <span class="btn">
            <a-popconfirm
              title="确定要删除吗"
              @confirm="() => onDelete(record._id)"
            >
              <span href="javascript:;">删除</span>
            </a-popconfirm></span
          >
          <a-divider type="vertical" />
          <span
            :class="record.status == 0 || record.status == 1 ? 'none' : 'btn'"
            >发布</span
          >
          <a-divider type="vertical" />
          <span class="btn">训练发布</span>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="title"
      :visible="showmodal"
      :confirm-loading="confirmLoading"
      width="560px"
      :maskClosable="false"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form :form="form" @submit="handleSubmit" layout="horizontal">
        <a-form-item label="字段类型名称">
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
            style="height: 268px; width: 405px; resize: none"
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
            :placeholder="textareaVal"
          />
        </a-form-item>
        <a-form-item class="button">
          <a-button @click="handleCancel" class="mr"> 取消 </a-button>
          <a-button type="primary" html-type="submit"> 确定 </a-button>
        </a-form-item>
      </a-form>
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
import cache from "@/utils/cache";
import { cloneDeep } from "lodash";
import fileConversion from "@/utils/fileConversion";
const ocrService = OCRService.getOCRService();
const getOCRService = OCRService.getOCRService();
@Component
export default class fieldTypeManagement extends Vue {
  textareaVal: string =
    "请输入词典内容，每个字段值换行风格，如：" +
    `\n` +
    "北京市" +
    `\n` +
    "天津市" +
    `\n` +
    "上海市" +
    `\n` +
    "重庆市" +
    `\n` +
    "空行和重复字段会被自定忽略;";
  contentValue: string = "";
  showmodal: boolean = false;
  confirmLoading: boolean = false;
  form: any = "";
  fieldTypecolumns: any = [
    {
      title: "字段类型名称",
      dataIndex: "name"
    },
    {
      title: "训练状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "发布时间",
      dataIndex: "releaseTime"
    },
    {
      title: "最近保存时间",
      dataIndex: "updateTime"
    },
    {
      title: "预告准确率",
      dataIndex: "accuracy",
      scopedSlots: { customRender: "accuracy" }
    },
    {
      title: "操作",
      dataIndex: "action",
      scopedSlots: { customRender: "action" }
    }
  ];
  fieldTypeData: any = [];
  parmesdata: any = {
    page: 1,
    per_page: "10"
  };
  showOkBAtn: boolean = false;
  formMothed: any = {};
  title: string = "";
  iseditor: boolean = false;
  fieldId: string = "";
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
  // 分页器
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  page: number = 1;
  created() {
    this.paginationConfig = {
      showQuickJumper: true,
      defaultCurrent: 1,
      defaultPageSize: 10,
      // current: this.page,
      class: "my-pagination",
      // pageSize: 2,
      hideOnSinglePage: true
      // total: this.totalCount,
      // change: this.onPageChange,
    };
    console.log("11", this.paginationConfig);
    this.form = this.$form.createForm(this, { name: "validate_other" });
    this.getUserFieldList();
  }
  // 创建新的字段类型
  createfieldtype() {
    this.iseditor = false;
    this.title = "创建字段类型";
    this.showmodal = true;
    console.log(this.showmodal);
  }
  // 获取列表
  async getUserFieldList() {
    const useId = cache.localGet("ai-front-id");
    const res = await getOCRService.getUserFieldList();
    if (res) {
      console.log("列表res", res);
      this.fieldTypeData = res;
      this.totalCount = res.length;
    }
  }
  // 删除字段
  async deleteUserFieldList(id: any) {
    const res = await getOCRService.deleteUserFieldList(id);
    if (res == 1) {
      console.log("res", res);
      this.getUserFieldList();
      this.$message.success("已删除");
    }
  }
  // 新增字段
  async addUserFieldList(id: any) {
    const res = await getOCRService.addUserFieldList(id);
    if (res) {
      console.log("添加成功", res);
      this.showmodal = false;
      this.getUserFieldList();
      this.$message.success("创建成功");
    }
  }
  // 更新修改字段
  async updateUserFieldList(id: any) {
    const res = await getOCRService.updateUserFieldList(id);
    if (res) {
      console.log("更新成功", res);
      this.showmodal = false;
      this.getUserFieldList();
      this.$message.success("编辑成功");
    }
  }
  // 确认删除字段
  onDelete(key: any) {
    console.log(key);
    this.deleteUserFieldList(key);
  }
  // 编辑字段
  editorFieldList(id: any, name: any, content: Array<any>) {
    console.log("121", id, name, content);
    this.title = "编辑字段类型";
    this.showmodal = true;
    this.iseditor = true;
    this.fieldId = id;
    this.contentValue = "";
    content.map(item => {
      this.contentValue += item + "\n";
    });
    this.$nextTick(() => {
      this.form.setFieldsValue({
        name: name,
        content: this.contentValue
      });
    });
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
        console.log("Received values of form: ", values);
        let { name, content } = values;
        let arr: Array<any> = content.replace(/[\r\n]/g, ",").split(",");
        let newarr: Array<any> = [];
        arr.map(item => {
          if (item !== "") {
            let list: Array<any> = item.trim().split("");
            let arrs: any = [];
            list.map(i => {
              if (i !== " ") {
                arrs.push(i);
              }
            });
            arrs = arrs.join("");
            newarr.push(arrs);
          }
        });
        let params: any = {
          name: name,
          content: newarr
        };
        if (this.iseditor) {
          params = {
            ...params,
            _id: this.fieldId
          };
          this.updateUserFieldList(params);
        } else {
          this.addUserFieldList(params);
        }
      }
    });
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
  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
  }
}
</script>

<style lang="scss" scoped>
@import "./css/templateList.scss";
@import "./css/fieldListStyle.scss";
</style>
