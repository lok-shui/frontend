<template>
  <div class="user-contain">
    <!-- 账号信息页面 -->
    <div class="infoWrap">
      <div class="title"><b>账号信息</b></div>
      <div class="form-contain defaultStyle" v-show="defaultPage">
        <div class="detailStyle">
          <div>
            <span>用户名</span><span>{{ userInfo.username }}</span>
          </div>
          <div>
            <span>姓名</span><span>{{ userInfo.realName }}</span>
          </div>
          <div>
            <span>emai</span><span>{{ userInfo.email }}</span>
          </div>
          <div>
            <span>公司名称</span><span>{{ userInfo.company }}</span>
          </div>
          <div>
            <span>手机号</span><span>{{ userInfo.phone }}</span>
          </div>
        </div>
        <div class="passwordStyle">
          <div class="title"><b>账号密码</b></div>
          <div class="currentpsd">
            <span>当前密码强度：</span>
            <b v-if="psdLevel <= 1">弱</b>
            <b v-if="psdLevel == 2">中</b>
            <b v-if="psdLevel == 3">强</b>
          </div>
        </div>
        <a-button class="editBtn" @click="editChange">编辑</a-button>
      </div>

      <div class="form-contain editStyle" v-show="!defaultPage">
        <a-form class="info-form" :form="form" @submit="handleSubmit">
          <a-row :gutter="24">
            <a-col v-for="item in formItems" :key="item.key" :span="24">
              <a-form-item
                v-if="item.required"
                :label="item.label"
                class="lineItem"
              >
                <a-input
                  class="input"
                  v-decorator="[
                    item.key,
                    {
                      rules: [
                        {
                          required: true,
                          message: `${item.label}不能为空`
                        }
                      ]
                    }
                  ]"
                  :placeholder="`请输入${item.label}`"
                ></a-input>
              </a-form-item>
              <a-form-item v-else :label="item.label" class="lineItem">
                <a-input
                  v-if="item.label == '用户名'"
                  class="input"
                  style="opacity: 0.5; pointer-events: none"
                  v-decorator="[item.key]"
                ></a-input>
                <a-input
                  v-else
                  class="input"
                  v-decorator="[
                    item.key,
                    {
                      rules: [
                        {
                          required: false,
                          message: `${item.label}不能为空`
                        }
                      ]
                    }
                  ]"
                  :placeholder="`请输入${item.label}`"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="账号密码" class="editPagePsd">
                <div class="center password-contain">
                  <span class="text level"
                    >当前密码强度：
                    <b v-if="psdLevel <= 1">弱</b>
                    <b v-if="psdLevel == 2">中</b>
                    <b v-if="psdLevel == 3">强</b>
                  </span>
                  <a-button @click="showModal" :disabled="isModify"
                    >修改密码</a-button
                  >
                </div>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item class="btn-contain">
            <a-button
              :disabled="!isModify"
              v-if="!verifyBtnVisable"
              type="primary"
              html-type="submit"
              >保存</a-button
            >
            <a-button
              v-if="verifyBtnVisable"
              type="primary"
              class="btnBg"
              @click="showEmailModal"
              >验证</a-button
            >
            <a-button @click="cancelBack" class="cancelBtn">取消</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <!-- '修改密码'弹窗 -->
    <a-modal
      title="修改密码"
      v-model="modalVisable"
      :maskClosable="false"
      @ok="changePwd"
      class="changePSW"
      @cancel="handleCancel"
    >
      <a-form :form="modalForm">
        <a-form-item
          label="新密码"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input-password
            type="password"
            v-decorator="[
              'passwordNew',
              {
                rules: [
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '最少输入6个字符' },
                  { max: 16, message: '最多输入16个字符' },
                  {
                    pattern: /^[a-zA-Z0-9._-]{6,16}$/,
                    message: '不能包含中文和特殊字符'
                  }
                ]
              }
            ]"
            placeholder="请输入新密码,最多输入16个字符"
          ></a-input-password>
        </a-form-item>
        <a-form-item
          label="确认新密码"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input-password
            type="password"
            v-decorator="[
              'passwordNew2',
              {
                rules: [
                  { required: true, message: '请再次输入新密码' },
                  {
                    pattern: /^[a-zA-Z0-9._-]{6,16}$/,
                    message: '不能包含中文和特殊字符'
                  },
                  { validator: compareToFirstPassword }
                ]
              }
            ]"
            placeholder="请再次输入新密码"
          ></a-input-password>
        </a-form-item>

        <a-form-item
          label="验证码"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            style="width: 60%"
            v-decorator="[
              'verify',
              { rules: [{ required: true, message: '请输入验证码' }] }
            ]"
            placeholder="请输入验证码"
          ></a-input>
          <a-button
            class="VerifyCode"
            type="default"
            @click="sendMail"
            v-show="verificationCode"
            >发送邮箱验证码</a-button
          >
          <a-button class="VerifyCode" disabled v-show="!verificationCode"
            >{{ count }}s后可重新获取</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- '验证邮箱'弹窗 -->
    <a-modal
      title="验证邮箱"
      class="changeEmail"
      :maskClosable="false"
      v-model="verifyVisable"
      @ok="changeVerify"
      @cancel="cancelVerify"
    >
      <a-form :form="verifyForm">
        <a-form-item
          label="验证码"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            style="width: 60%"
            @keyup.native="
              $event.target.value = $event.target.value.replace(/[, ]/g, '')
            "
            v-decorator="[
              'verify',
              { rules: [{ required: true, message: '请输入验证码' }] }
            ]"
            placeholder="请输入验证码"
          ></a-input>
          <a-button
            class="VerifyCode"
            type="default"
            @click="sendMail"
            v-show="verificationCode"
            >发送邮箱验证码</a-button
          >
          <a-button class="VerifyCode" disabled v-show="!verificationCode"
            >{{ count }}s后可重新获取</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UserService from "@/service/user";
import { cloneDeep } from "lodash";

const userService = UserService.getUserService();

@Component
export default class UserInfo extends Vue {
  form: any = {};
  modalForm: any = {};
  modalVisable: boolean = false;
  isModify: boolean = false;
  psdLevel: number = 0;
  defaultPage: boolean = true;
  editPage: boolean = false;

  formItems: any[] = [
    { label: "用户名", key: "username", required: false },
    { label: "姓名", key: "realName", required: false },
    { label: "手机号", key: "phone", required: true },
    { label: "E-mail", key: "email", required: true },
    { label: "公司名称", key: "company", required: false }
  ];

  get userInfo() {
    return this.$store.state.user;
  }
  verificationCode: boolean = true; // 验证码
  verifyForm: any = {};
  verifyVisable: boolean = false; // 验证码弹窗
  verifyBtnVisable: boolean = false; // 更新的btn
  paramsVal: any = {}; // 参数值
  verifyValue: string = ""; // 验证码值
  count: number = 60;
  timer: any = null;
  changeEmail: string = ""; // 改变的邮箱值

  created() {
    if (this.$store.state.user.username !== null) {
      this.$store.dispatch("getUserInfo");
    }
    this.form = this.$form.createForm(this, {
      onFieldsChange: (props: any, fields: any) => {
        const loginUserInfoStr = this.getUserInfo2Str(this.userInfo); // 把loginUserInfoStr从外层移到里层
        const temp = fields[Object.keys(fields)[0]];
        const form = this.form;
        if (loginUserInfoStr !== this.getUserInfo2Str(form.getFieldsValue())) {
          this.isModify = true;
          if (this.userInfo.email !== form.getFieldsValue().email) {
            this.verifyBtnVisable = true;
            this.changeEmail = form.getFieldsValue().email;
            console.log("邮箱值改变了");
          } else {
            this.verifyBtnVisable = false;
          }
        } else {
          this.isModify = false;
          this.verifyBtnVisable = false;
        }
      }
    });
    this.modalForm = this.$form.createForm(this, {});
    this.verifyForm = this.$form.createForm(this, {});
  }

  @Watch("userInfo", { deep: true })
  handlechange() {
    this.handleUserChange();
    this.psdLevel = this.$store.state.user.pswRank;
  }

  @Watch("$store.state.user", { deep: true })
  handleChanges() {
    if (this.$store.state.user.username == null) {
      this.$router.push("/login");
    }
  }

  mounted() {
    this.handleUserChange();
    this.psdLevel = this.$store.state.user.pswRank;
  }

  editChange() {
    this.defaultPage = false;
    this.editPage = true;
  }

  getUserInfo2Str(userInfo: any) {
    return ["username", "company", "phone", "email", "realName"]
      .map((m: any) => {
        const val = userInfo[m];
        return val ? val : "";
      })
      .join(",");
  }

  handleUserChange() {
    const {
      username,
      company,
      phone,
      email,
      realName,
      pswRank
    } = this.userInfo;
    this.form.setFieldsValue({
      username,
      company,
      phone,
      email,
      realName,
      pswRank
    });
  }

  // 更新账号信息1
  handleSubmit(e: any) {
    e.preventDefault();
    this.verifyBtnVisable = false;
    this.verifyVisable = false;
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      if (values.realName == "") {
        delete values.realName;
      }
      if (values.company == "") {
        delete values.company;
      }
      this.paramsVal = cloneDeep(values);
    });
    if (this.verifyValue !== "") {
      this.paramsVal.verifyCode = this.verifyValue.trim();
      this.paramsVal.isEmailChanged = true;
    }
    if (this.userInfo.id) {
      this.updateInfo(this.userInfo.id, this.paramsVal);
    }
  }

  async updateInfo(id: number, params: any) {
    const response = await userService.updateUserInfo(id, params);
    if (response) {
      this.$message.success(response);
      this.$store.dispatch("getUserInfo");
      this.userInfo.email = this.changeEmail;
      location.reload();
      this.isModify = false;
      this.modalVisable = false;
      this.verifyVisable = false;
      this.defaultPage = true;
    }
  }
  // 取消-恢复原值
  cancelBack() {
    this.handleUserChange();
    this.defaultPage = true;
  }

  // 获取验证码
  async sendMail() {
    this.isModify = true;
    this.verificationCode = false;
    let email = "";
    this.form.validateFields((err: any, values: any) => {
      email = values.email;
    });
    const response = await userService.sendMail({ email: email });
    if (response) {
      this.$message.success(response);
      if (!this.timer) {
        this.count = 60;
        this.verificationCode = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--;
          } else {
            this.verificationCode = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }

  // 修改密码-弹窗
  showModal() {
    this.verificationCode = true;
    if (this.verifyBtnVisable == true) {
      this.$message.error("先验证新输入的邮箱账号");
    } else {
      this.modalVisable = true;
    }
  }

  // '修改密码'弹窗-OK
  changePwd(e: any) {
    e.preventDefault();
    this.modalForm.validateFields((err: any, values: any) => {
      if (err) return;
      const { passwordNew, passwordNew2 } = values;
      if (passwordNew === passwordNew2) {
        values["password"] = passwordNew;
        delete values.passwordNew;
        delete values.passwordNew2;
        const param = {
          verify: values["verify"].trim(),
          password: values["password"],
          email: this.userInfo.email
        };
        // 修改传参
        this.updatePassword(param);
      } else {
        this.$message.warning("两次输入的密码不一致");
      }
    });
  }

  async updatePassword(params: any) {
    const response = await userService.changePwd(params);
    if (response) {
      this.$message.success("修改密码成功");
      this.modalVisable = false;
      clearInterval(this.timer);
      this.timer = null;
      this.count = 60;
    }
  }

  // '修改密码'弹窗-取消：清空内容
  handleCancel(e: any) {
    this.modalForm.resetFields();
    this.modalVisable = false;
    clearInterval(this.timer);
    this.timer = null;
    this.count = 60;
  }

  compareToFirstPassword(rule: any, value: any, callback: any) {
    const form = this.modalForm;
    if (value && value !== form.getFieldValue("passwordNew")) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  }

  // 展示'验证邮箱'弹窗
  showEmailModal() {
    this.verifyVisable = true;
    this.verificationCode = true;
  }

  // '验证邮箱'弹窗-OK
  changeVerify() {
    this.verifyForm.validateFields((err: any, values: any) => {
      if (err) return;
      if (values.verify) {
        this.verifyValue = values.verify.trim();
        this.verifyBtnVisable = false;
        this.verifyVisable = false;
      }
      clearInterval(this.timer);
      this.timer = null;
      this.count = 60;
    });
  }

  // '验证邮箱'弹窗-取消
  cancelVerify() {
    this.verifyBtnVisable = true;
    this.verifyVisable = false;
    clearInterval(this.timer);
    this.timer = null;
    this.count = 60;
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
@import "./css/Info.scss";
</style>
