<template>
  <div class="bgColor">
    <div class="fiterEdit">
      <div class="header">
        <b class="title">基本信息</b>
      </div>
      <div class="newsBox">
        <div class="newsBoxlist">
          <div class="news">分类器名称</div>
          <b class="usenewsdata">{{ classifierdData.name }}</b>
          <div class="copy" @click="changename">修改名称</div>
        </div>
        <div class="newsBoxlist">
          <div class="usetitle">分类器 ID</div>
          <b class="usenewsdata">{{ classifierdData._id }}</b>
          <div class="copy" @click="copykey(classifierdData._id)">复制</div>
        </div>
        <div class="newsBoxlist">
          <div class="usetitle">包含模板数量</div>
          <b class="usenewsdata">{{ classifierdData.templateCount }}</b>
        </div>
        <div class="newsBoxlist">
          <div class="usetitle">状态</div>
          <b class="usenewsdata">{{
            classifierdData.trainingState == 0
              ? "未训练"
              : classifierdData.trainingState == 1
              ? "训练完成"
              : "待确认"
          }}</b>
        </div>
      </div>
      <div class="Content">
        <div class="header">
          <b class="title">添加模板</b>
        </div>
        <div class="template">
          <div class="texts">
            您可选择以图中关键词或图片版式特征作为分类依据（详情参考技术文档），但需保证所有模板全部填写关键词或上传训练集图片，如关键词及训练集图片均未覆盖全部模板则无法进行训练。
          </div>
          <div class="addtemplate">
            <div class="presettemplate" @click="addextClassList">
              添加预置模板
            </div>
            <div class="presettemplate" @click="addtemplateSignList">
              添加自定义模板
            </div>
          </div>
        </div>
        <p class="prompt" v-show="editdata.length == 0">
          请至少添加2个模板参与分类器训练
        </p>
        <a-table
          :columns="editcolumns"
          :data-source="editdata"
          :class="editdata.length == 0 ? 'nodata' : ''"
        >
          <template
            v-for="col in ['keyWords']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                :placeholder="'请输入关键词'"
                @change="e => advantageHandleChange(e.target.value, index, col)"
                @pressEnter="
                  e => advantageHandleEnter(e.target.value, index, col)
                "
              />
              <template v-else>
                <a-icon
                  v-if="text == null"
                  class="editicon"
                  type="plus"
                  @click="() => editfield(index, true)"
                />
                <a-icon
                  v-if="text !== null"
                  class="editicon"
                  type="form"
                  @click="() => editfield(index, true)"
                />
                <span :class="text == null ? 'red' : ''">{{
                  text == null ? "请添加" : text
                }}</span>
              </template>
            </div>
          </template>
          <template slot="accuracy" slot-scope="accuracy">
            <span>{{ accuracy + "%" }}</span>
          </template>
          <span slot="action" slot-scope="text, record">
            <span class="btn">编辑训练集</span>
            <a-divider type="vertical" />
            <span class="btn">清空关键词</span>
            <a-divider type="vertical" />
            <span class="btn">
              <a-popconfirm
                title="确定要删除吗"
                @confirm="() => delthistemplateSign(record)"
              >
                <span href="javascript:;">删除</span>
              </a-popconfirm></span
            >
          </span>
        </a-table>
        <a-empty
          v-show="editdata.length == 0"
          class="empty"
          image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
          :image-style="{
            height: '200px'
          }"
        >
          <span slot="description">您还未添加任何模板</span>
          <!-- <a-button type="primary">+ 创建分类器 </a-button> -->
        </a-empty>
      </div>
    </div>
    <!-- "创建模板"弹窗 -->
    <a-modal
      title="添加自定义模板"
      :visible="isshow"
      :maskClosable="false"
      class="createModal"
      @ok="confirmBtn"
      @cancel="handleCancel"
    >
      <a-form :form="createForm">
        <a-form-item label="自定义模板">
          <a-select
            show-search
            mode="tags"
            v-decorator="[
              'gender',
              {
                rules: [{ required: true, message: '请选择模板' }]
              }
            ]"
            placeholder="请输入或选择预置模板"
            @change="changeselect"
          >
            <a-select-option
              :value="item.templateSign"
              v-for="(item, index) in selectdata"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-model-item label="模板照片：" required>
          <a-upload
            v-if="modalPreviewImage == ''"
            list-type="picture-card"
            :file-list="imgList"
            :customRequest="uploadCreateImage"
          >
            <div class="flexCom">
              <div><img src="@/assets/images/v3/icon_unload.svg" alt="" /></div>
              <div class="middle">上传压缩包</div>
              <div>
                请上传至少30张同一模板图片的压缩包
                文件大小不超过200，仅限ZIP格式。
              </div>
            </div>
          </a-upload>

          <div class="createImgBox flexCen" v-if="modalPreviewImage !== ''">
            <img :src="modalPreviewImage" alt="" />
            <div class="toChoose flexCen" @click="toChooseBtn">重新选择</div>
          </div>
        </a-form-model-item>
      </a-form>
    </a-modal>
    <!-- 修改分类器名称 -->
    <a-modal
      :title="title"
      :visible="showmodal"
      :confirm-loading="confirmLoading"
      width="560px"
      :maskClosable="false"
      :footer="null"
      @cancel="changeCancel"
    >
      <a-form :form="form" @submit="handleSubmit" layout="horizontal">
        <a-form-item :label="changelabel">
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
            :placeholder="textareaVal"
          />
        </a-form-item>
        <a-form-item class="button">
          <a-button @click="changeCancel" class="mr"> 取消 </a-button>
          <a-button type="primary" html-type="submit"> 确定 </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 添加预置模板 -->
    <a-modal
      title="添加预置模板"
      :visible="extshow"
      :confirm-loading="confirmLoading"
      width="560px"
      :maskClosable="false"
      :footer="null"
      @cancel="changeCancel"
    >
      <a-form :form="extform" @submit="confirmadd" layout="horizontal">
        <a-form-item label="预置模板">
          <a-checkbox-group
            v-decorator="[
              'extClassList',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择模板'
                  }
                ]
              }
            ]"
            style="width: 100%"
          >
            <a-row>
              <a-col
                :span="12"
                v-for="(item, index) in selectdata"
                :key="index"
              >
                <a-checkbox :value="item.templateSign">
                  {{ item.name }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item class="button">
          <a-button @click="changeCancel" class="mr"> 取消 </a-button>
          <a-button type="primary" html-type="submit"> 确定 </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { windownCopy } from "@/utils/copyMothed";
import OCRService from "@/service/ocrTem";
import cache from "@/utils/cache";
const getOCRService = OCRService.getOCRService();
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
function blobToBase64(blob: any) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error("blobToBase64 error"));
    };
  });
}
@Component
export default class classifiterEdit extends Vue {
  editcolumns: any = [
    {
      title: "模板名称",
      dataIndex: "name"
    },
    {
      title: "模板ID",
      dataIndex: "templateSign",
      scopedSlots: { customRender: "templateSign" }
    },
    {
      title: "分类关键词",
      dataIndex: "keyWords",
      scopedSlots: { customRender: "keyWords" }
    },
    {
      title: "训练集图片数量",
      dataIndex: "trainingCount"
    },
    {
      title: "训练集状态",
      dataIndex: "trainingState",
      scopedSlots: { customRender: "trainingState" }
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
  // 模板
  editdata: Array<any> = [];
  selectdata: Array<any> = [];
  // 创建模板
  isshow: boolean = false;
  createForm: any = "";
  modalPreviewImage: string = "";
  // 上传图片
  imgList: any = [];
  uploadParams: any;
  responseId: any;
  editingKey: string = "";
  classifierdId: string = "";
  classifierdData: any = {};
  selectoption: string = "";
  templatetype: any = "0";
  selectlist: Array<any> = [];
  classifiername: string = "";
  confirmLoading: boolean = false;
  title: string = "";
  changelabel: string = "";
  textareaVal: string = "";
  showmodal: boolean = false;
  form: any = "";
  extform: any = "";
  extshow: boolean = false;
  created() {
    this.createForm = this.$form.createForm(this, {});
    this.classifierdId = this.$route.params.id;
    this.form = this.$form.createForm(this, {});
    this.extform = this.$form.createForm(this, {});
    this.getclassifierd();
  }
  // 获取列表
  async getclassifierd() {
    const res = await getOCRService.getclassifierd(this.classifierdId);
    if (res) {
      console.log("res", res);
      this.classifierdData = res;
      this.editdata = [...res.extClassList, ...res.templateSignList];
    }
  }
  async getextClass() {
    const res = await getOCRService.getextClass(this.classifierdId);
    if (res) {
      console.log("预置模板res", res);
      this.selectdata = res;
      this.extshow = true;
      let list: Array<any> = [];
      this.selectdata.map(item => {
        if (item.isChose == "1") {
          list.push(item.templateSign);
        }
      });
      this.selectlist = list;
      this.$nextTick(() => {
        this.createForm.setFieldsValue({
          gender: list
        });
      });
    }
  }
  async gettemplateClass() {
    const res = await getOCRService.gettemplateClass(this.classifierdId);
    if (res) {
      console.log("自定义res", res);
      this.selectdata = res;
      this.isshow = true;
      let list: Array<any> = [];
      this.selectdata.map(item => {
        if (item.isChose == "1") {
          list.push(item.templateSign);
        }
      });

      this.selectlist = list;
      this.$nextTick(() => {
        this.extform.setFieldsValue({
          extClassList: list
        });
      });
    }
  }
  async putClassList(params: any) {
    const res = await getOCRService.putClassList(params);
    if (res) {
      console.log("更新成功", res);
      this.$message.success("添加成功");
      this.getclassifierd();
      this.isshow = false;
      this.showmodal = false;
    }
  }
  async deltemplateSign(params: any) {
    const res = await getOCRService.deltemplateSign(this.classifierdId, params);
    if (res) {
      console.log("更新成功", res);
      this.$message.success("删除模板成功");
      this.getclassifierd();
    }
  }
  copykey(key: any) {
    let iscopy = windownCopy(key);
    if (iscopy) {
      this.$message.success("复制成功");
    }
  }
  addextClassList() {
    this.getextClass();
    this.templatetype = "1";
  }
  addtemplateSignList() {
    this.gettemplateClass();
    this.templatetype = "2";
  }
  changename() {
    this.templatetype = "0";
    this.showmodal = true;
    this.title = "修改分类器名称";
    this.changelabel = "分类器名称";
    this.textareaVal = "请填写分类器名称";
  }
  confirmBtn() {
    let params: any = {
      _id: this.classifierdId
    };
    if (this.templatetype == "1") {
      params = {
        ...params,
        type: this.templatetype,
        extClassList: this.selectlist
      };
    } else if (this.templatetype == "2") {
      params = {
        ...params,
        type: this.templatetype,
        templateSignList: this.selectlist
      };
    } else if (this.templatetype == "0") {
      params = {
        ...params,
        type: this.templatetype,
        name: this.classifiername
      };
    }
    this.putClassList(params);
  }
  handleCancel() {
    this.isshow = false;
  }
  handleSelectChange(value: any) {
    console.log(value);
  }
  // '创建模板'-upload
  async uploadCreateImage(file: any) {
    console.log("file", file);

    this.createForm.name = file.file.name;
    file.preview = await getBase64(file.file);
    this.modalPreviewImage = file.preview;
    this.uploadParams = new FormData();
    this.uploadParams.append("photo", file.file);
    this.uploadParams.append("name", file.file.name);
    this.imgList = [file.file];
    console.log("upload", this.imgList);
  }
  // '创建模板'- 重新选择
  toChooseBtn() {
    this.modalPreviewImage = "";
    this.createForm.name = "";
    this.imgList = [];
  }
  // 编辑
  editfield(key: any, type: boolean) {
    console.log(key);
    const newData = [...this.editdata];
    const target = newData[key];
    target.editable = type;
    this.editdata = newData;
    console.log(" this.editdata", this.editdata);
  }
  advantageHandleChange(value: string, key: number, column: "fiercontent") {
    const newData = [...this.editdata];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.editdata = newData;
    }
  }
  advantageHandleEnter(value: string, key: number, column: "fiercontent") {
    const newData = [...this.editdata];
    const target = newData[key];
    target.editable = false;
    this.editdata = newData;
    console.log(" this.editdata", this.editdata);
  }
  changeselect(value: any) {
    console.log(value);
    this.selectlist = value;
  }
  delthistemplateSign(row: any) {
    console.log("row", row.templateSign);
    const data = {
      templateSign: row.templateSign
    };
    this.deltemplateSign(data);
  }
  changeCancel() {
    this.showmodal = false;
    this.extshow = false;
  }
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log(values);
        this.classifiername = values.content;
        this.confirmBtn();
      }
    });
  }
  confirmadd(e: any) {
    console.log(3333);
    e.preventDefault();
    this.extform.validateFields((err: any, values: any) => {
      if (!err) {
        this.selectlist = values.extClassList;
        this.confirmBtn();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "./css/templateList.scss";
@import "./css/fieldListStyle.scss";

.newsBox {
  display: flex;
  justify-content: space-around;
  padding-bottom: 32px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(232, 232, 232, 1);
  margin: 40px 0;
  .newsBoxlist {
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
    .news {
      position: absolute;
      top: -10px;
      left: 0;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
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
.editicon {
  margin-right: 5px;
  color: red;
}

.createModal {
  /deep/.ant-select-selection--single,
  /deep/.ant-form-item-control {
    width: 415px;
  }
  /deep/.ant-form-item-label {
    width: 85px;
  }
}
/deep/.ant-col-12 {
  margin-bottom: 26px;
}
/deep/.ant-form-item-label {
  line-height: 23px;
}
</style>
