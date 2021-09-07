<template>
  <div>
    <!-- '合作咨询'组件 -->
    <a-modal
      title="合作咨询"
      v-model="visibleModal"
      :maskClosable="false"
      width="593px"
      class="modalStyle"
      @cancel="cancelModal"
    >
      <div class="consult" v-if="!showSuccess">
        <p class="txt">
          填写以下表填，我们专家会尽快与您联系！并为您提供需要的解决方案。
        </p>
        <a-form :form="form" @submit="handleSubmit" v-model="form">
          <a-form-item label="咨询服务">
            <div class="selectStyle">
              <a-select
                @change="handleSelectChange"
                v-decorator="[
                  'serviceType',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选中想咨询的服务类型和内容'
                      }
                    ]
                  }
                ]"
                placeholder="服务类型"
                class="selectItem"
              >
                <a-select-option v-for="item in serviceVal" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
              <a-select
                v-decorator="[
                  'service',
                  {
                    rules: [{ required: true, message: '请选中服务内容' }]
                  }
                ]"
                placeholder="服务内容"
                @change="handleOptionChange"
                class="selectItem"
              >
                <a-select-option v-for="level2 in services" :key="level2">
                  {{ level2 }}
                </a-select-option>
              </a-select>
            </div>
          </a-form-item>

          <a-form-item label="咨询内容" class="textarea">
            <a-textarea
              v-decorator="['descContent', {}]"
              placeholder="请输入您需要咨询的内容"
              :rows="3"
            />
          </a-form-item>

          <a-form-item label="企业名称">
            <a-input
              v-decorator="[
                'companyName',
                {
                  rules: [
                    {
                      required: true,
                      message:
                        '企业用户请填写您所在的公司名称，个人用户填写个人'
                    }
                  ]
                }
              ]"
              placeholder="企业用户请填写您所在的公司名称，个人用户填写个人"
            ></a-input>
          </a-form-item>

          <a-form-item label="姓名称呼">
            <a-input
              v-decorator="[
                'consultants',
                {
                  rules: [
                    {
                      required: true,
                      message: '请填写您的姓名称呼便于我们与您联系'
                    }
                  ]
                }
              ]"
              placeholder="请填写您的姓名称呼便于我们与您联系"
            ></a-input>
          </a-form-item>

          <a-form-item label="手机号码">
            <a-input
              v-decorator="[
                'phone',
                {
                  rules: [
                    { required: true, message: phoneMsg },
                    {
                      pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
                      message: '手机号码的格式似乎不正确'
                    }
                  ]
                }
              ]"
              placeholder="请正确填写您的手机号码"
            ></a-input>
          </a-form-item>

          <a-form-item label="电子邮箱">
            <a-input
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
                    },
                    {
                      required: true,
                      message: '邮箱不能为空'
                    }
                  ]
                }
              ]"
              placeholder="请正确填写您的电子邮箱地址"
            ></a-input>
          </a-form-item>

          <a-button
            :class="disable == true ? 'submit' : 'activeSubmit'"
            :disabled="disable"
            html-type="submit"
            >提交</a-button
          >
        </a-form>
      </div>

      <div class="success" v-if="showSuccess">
        <div class="imgs">
          <img src="@/assets/images/v2/icon_success.png" alt="" />
        </div>
        <div class="bolds">你的申请已经提交成功！</div>
        <div class="grays">
          我们会尽快安排工作人员与您联系，请保持电话通畅！
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UserService from "@/service/user";
import cache from "@/utils/cache";
const userService = UserService.getUserService();

@Component
export default class Scenary extends Vue {
  @Prop({}) appearModal!: boolean;
  form: any = {};
  visibleModal: boolean = false;
  secondOption: string = "";
  disable: boolean = false;
  showSuccess: boolean = false;

  phoneMsg: string = "请正确填写您的手机号码";
  serviceVal: any[] = [];
  optionVal: any = {};
  services: any[] = [];
  datas: any = cache.localGet("navData").data;

  created() {
    this.form = this.$form.createForm(this, {});
  }

  mounted() {
    this.datas.forEach((item: any, key: number) => {
      this.serviceVal.push(item.level1);
    });

    if (this.appearModal == true) {
      this.visibleModal = true;
    } else {
      this.visibleModal = false;
    }
  }

  handleSelectChange(value: any) {
    this.services = [];
    this.datas.forEach((item: any, key: number) => {
      if (item.level1 == value) {
        item.level2.forEach((s: any, sk: number) => {
          s.services.forEach((t: any, tk: number) => {
            this.services.push(t.name);
          });
        });
      }
    });
  }

  handleOptionChange(value: any) {
    this.secondOption = value;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.showSuccess = false;
    this.form.validateFields((err: any, values: any) => {
      console.log("values", values);
      if (err) return;
      if (values) {
        this.sendConsult(values);
      }
    });
  }

  // 关闭弹窗
  cancelModal() {
    this.form.setFieldsValue({
      serviceType: "",
      service: "",
      companyName: "",
      consultants: "",
      phone: "",
      email: ""
    });
    this.visibleModal = false;
    this.showSuccess = false;
    this.$emit("controlModal", this.visibleModal);
  }

  // 合作咨询接口
  async sendConsult(params: any) {
    const response = await userService.postConsult(params);
    if (response) {
      this.showSuccess = true;
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../css/Consult.scss";
</style>
