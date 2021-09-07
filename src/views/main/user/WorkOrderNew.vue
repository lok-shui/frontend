<template>
  <div class="user-contain">
    <a-form :form="form" @submit="handleSubmit" class="workOrderForm">
      <a-form-item label="咨询类型">
        <div class="flex">
          <a-button
            v-for="(item, index) in consultType"
            :key="index"
            :class="typeIndex == index ? 'focusType' : 'typeCard'"
            @click="chooseType(item)"
          >
            <span
              v-if="item.svgFont"
              :class="[item.svgFont, 'iconSize']"
            ></span>

            <span
              v-decorator="[
                'type',
                { rules: [{ required: true, message: '请选择咨询类型' }] }
              ]"
              >{{ item.theme }}</span
            >
          </a-button>
        </div>
      </a-form-item>

      <div class="subLabel">（你可以选择一个或多个咨询服）</div>
      <a-form-item label="咨询服务">
        <a-tabs default-active-key="0">
          <a-tab-pane
            v-for="(item, index) in plainOptionsName"
            :key="index"
            :tab="plainOptionsName[index]"
          >
            <div
              v-for="(item, index) in plainOptions[index]"
              :key="index"
              v-decorator="[
                'products',
                { rules: [{ required: true, message: '请选择咨询服务' }] }
              ]"
            >
              <a-checkbox-group>
                <a-checkbox
                  @change="changeTabRadio(item.apiName)"
                  :key="item.apiId"
                  :value="item.apiName"
                  >{{ item.apiName }}
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form-item>

      <div class="subLabel">（你可以选择一个或多个咨询应用）</div>
      <a-form-item label="应用平台">
        <a-checkbox-group
          v-decorator="[
            'platform',
            { rules: [{ required: true, message: '请选择应用平台' }] }
          ]"
        >
          <a-checkbox
            v-for="item in platform"
            :key="item.label"
            :value="item.label"
            >{{ item.label }}</a-checkbox
          >
        </a-checkbox-group>
      </a-form-item>

      <div class="subLabel">（你可以选择一个或多个接入方式）</div>
      <a-form-item label="接入方式">
        <a-checkbox-group
          v-decorator="[
            'accessMethod',
            { rules: [{ required: true, message: '请选择接入方式' }] }
          ]"
        >
          <a-checkbox
            v-for="item in concatType"
            :key="item.value"
            :value="item.label"
            >{{ item.label }}</a-checkbox
          >
        </a-checkbox-group>
      </a-form-item>

      <div class="subLabel">（请填写有效信息，以确保满足需求）</div>
      <a-form-item label="接入需求" style="border: 0">
        <a-textarea
          v-decorator="[
            'demand',
            {
              rules: [{ max: 300, message: '最多输入300个字符' }]
            }
          ]"
          placeholder="请输入您需要咨询的内容, 最多输入300个字符"
          :maxLength="300"
          class="textareaStyle"
        />
      </a-form-item>
      <div class="createOrder">
        <a-button type="primary" html-type="submit"> 创建 </a-button>
        <a-button @click="cancelBtn" class="cancelBtn">取消</a-button>
      </div>
    </a-form>
    <a-modal width="352px" :visible="visible" okText="我知道了" @ok="confirmOk">
      <div class="maxImg">
        <img src="@/assets/images/v3/maxImg.png" alt="" />
      </div>
      <div class="boldWord">工单提交成功</div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import moment from "moment";
import cache from "@/utils/cache";
import UserService from "@/service/user";
import { timeFormat } from "@/utils/timeFormat";
import DocService from "@/service/doc";

const docService = DocService.getDocService();
const userService = UserService.getUserService();

@Component
export default class WorkOrderNew extends Vue {
  form: any = {};
  plainOptions: any = [];
  plainOptionsName: any = [];
  // 咨询类型
  consultType: Array<Object> = [
    {
      index: 0,
      theme: "售前咨询",
      svgFont: "icon-create1",
      icon: require("@/assets/images/v3/reac4.png")
    },
    {
      index: 1,
      theme: "续费咨询",
      svgFont: "icon-create2",
      icon: require("@/assets/images/v3/reac3.png")
    },
    {
      index: 2,
      theme: "申请试用",
      svgFont: "icon-create3",
      icon: require("@/assets/images/v3/reac1.png")
    },
    {
      index: 3,
      theme: "定制咨询",
      svgFont: "icon-create4",
      icon: require("@/assets/images/v3/reac2.png")
    }
  ];
  typeIndex: number = -1;
  typeVal: string = "";
  // 应用平台
  platform: Array<Object> = [
    { label: "Android", value: 0 },
    { label: "iOS", value: 1 },
    { label: "Windows", value: 2 },
    { label: "Linux", value: 3 },
    { label: "HTML5", value: 4 },
    { label: "小程序", value: 5 }
  ];
  // 接入方式↓↓↓
  concatType: any[] = [
    { label: "API", value: 0 },
    { label: "SDK", value: 1 },
    { label: "私有化部署", value: 2 }
  ];
  textVal: string =
    "1.产品功能介绍：" +
    `\n` +
    "2.应用场景：" +
    `\n` +
    "3.预估月调用量：" +
    `\n` +
    "4.预计接口使用时间：" +
    `\n` +
    "5.其他需求：";

  visible: boolean = false;
  serviceTabVal: Array<any> = [];

  created() {
    const useId = cache.localGet("ai-front-id");
    if (useId == null) {
      this.$router.push("/login");
      return;
    }
    this.form = this.$form.createForm(this, {});
    if (this.$store.state.user.username !== null) {
      this.getWorkApiList();
    }
  }

  mounted() {
    this.form.setFieldsValue({
      demand: this.textVal
    });
  }

  // 创建
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.setFieldsValue({
      type: this.typeVal
    });
    this.form.validateFields((err: any, values: any) => {
      values.products = this.serviceTabVal;
      values.type = this.typeVal;
      if (err) return;
      if (this.serviceTabVal.length == 0) {
        this.$message.error("请选择服务");
        return;
      }
      const { products, platform, accessMethod, demand } = values;
      const param = {
        uid: this.$store.state.user.id,
        type: this.typeVal,
        products: products.join(","),
        platform: platform.join(","),
        accessMethod: accessMethod.join(","),
        demand
      };
      if (this.$store.state.user.username !== null) {
        this.getNewWorkOrder(param);
      }
    });
  }
  // 取消
  cancelBtn() {
    this.routeBack();
  }

  chooseType(item: any) {
    this.typeVal = item.theme;
    this.typeIndex = item.index;
    this.form.setFieldsValue({
      type: this.typeVal
    });
  }

  // 咨询服务-tab
  changeTabRadio(e: any) {
    if (this.serviceTabVal.length == 0) {
      this.serviceTabVal.push(e);
      return;
    }
    let num = true;
    let arr: Array<any> = [];
    this.serviceTabVal.map((item, index) => {
      if (item == e) {
        num = false;
      } else {
        arr.push(item);
      }
    });
    if (!num) {
      this.serviceTabVal = arr;
    } else {
      this.serviceTabVal.push(e);
    }
  }

  // 咨询服务-tab
  async getWorkApiList() {
    const response = await docService.getWorkApiList();
    if (!response) return;
    const a = response;
    a.forEach((res: any, index: number) => {
      this.plainOptions.push(res.interfaces);
      this.plainOptionsName.push(res.name);
    });
  }

  // 新建接口
  async getNewWorkOrder(params: any) {
    const response = await userService.getNewWorkOrder(params);
    this.visible = true;
  }

  routeBack() {
    this.$router.go(-1);
  }

  confirmOk() {
    this.visible = false;
    this.routeBack();
  }
}
</script>

<style lang="scss" scoped>
@import "./css/workOrder.scss";
// icomoon字体
@import "../../../assets/style.css";
</style>
