<template>
  <div class="bgColor">
    <div class="topBar">
      <div class="logoWrap">
        <div class="logoBox" @click="homePage">
          <img src="@/assets/images/v2/DAIP_logo.svg" alt="logo" />
        </div>
      </div>
    </div>

    <div class="login-contain">
      <div class="login-form">
        <!-- <div class="sub-title">暗物AI赋能平台黑板板书识别系统</div> -->
        <div class="sub-title">AI赋能平台</div>

        <a-form class="form-contain" :form="form" @submit="handleSubmit">
          <a-form-item>
            <a-input
              size="large"
              v-decorator="[
                'username',
                {
                  rules: [
                    { required: true, message: '请输入用户名/邮箱/手机号' }
                  ]
                }
              ]"
              placeholder="请输入用户名/邮箱/手机号"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0, 0, 0, 0.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              @copy.native.capture.prevent="handleOperate"
              autocomplete="new-password"
              v-decorator="[
                'password',
                {
                  rules: [
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码不能少于6位' }
                  ]
                }
              ]"
              placeholder="请输入密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color: rgba(0, 0, 0, 0.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              class="input-code"
              size="large"
              @keyup.native="
                $event.target.value = $event.target.value.replace(/[, ]/g, '')
              "
              v-decorator="[
                'code',
                { rules: [{ required: true, message: '请输入验证码' }] }
              ]"
              placeholder="请输入验证码"
            ></a-input>
            <img
              title="点击刷新"
              @click="refreshVerifyCode"
              class="verify-code"
              :src="verifyCode"
            />
          </a-form-item>
          <a-form-item>
            <a class="btn" @click="registerPage">注册 </a>
            <a class="btn login-form-forgot" @click="showForgotModal">
              忘记密码？
            </a>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              size="large"
              html-type="submit"
              class="login-btn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- '忘记密码'弹窗 -->
      <a-modal
        title="忘记密码"
        v-model="forgotVisible"
        :maskClosable="false"
        @ok="forgotPassword"
        @cancel="forgotHandleCancel($event)"
        class="forgetPSW"
      >
        <a-form :form="forgotForm">
          <a-form-item label="用户邮箱" v-bind="formItemLayout">
            <div class="flex center flex-form">
              <a-input
                :readOnly="isRead"
                v-decorator="[
                  'email',
                  { rules: [{ required: true, message: '请输入用户邮箱' }] }
                ]"
                placeholder="请输入用户邮箱"
                @focus="focusEvent"
              ></a-input>
              <div class="verificationCode">
                <a-button
                  type="default"
                  @click="sendMail"
                  v-show="verificationCode"
                  >获取验证码</a-button
                >
                <a-button disabled v-show="!verificationCode"
                  >{{ count }}s后可重新获取</a-button
                >
              </div>
            </div>
          </a-form-item>

          <a-form-item label="新密码" v-bind="formItemLayout">
            <a-input-password
              type="password"
              :readOnly="isRead"
              v-decorator="[
                'passwordNew',
                {
                  rules: [
                    { required: true, message: '请输入新密码' },
                    { min: 6, message: '密码不能少于6位' },
                    { max: 16, message: '密码不能多于16位' },
                    {
                      pattern: /^[a-zA-Z0-9._-]{6,16}$/,
                      message: '密码格式不正确'
                    }
                  ]
                }
              ]"
              placeholder="新密码可包含字母、数字、下划线，不能包含中文和特殊字符"
              @focus="focusEvent"
            ></a-input-password>
          </a-form-item>

          <a-form-item label="确认新密码" v-bind="formItemLayout">
            <a-input-password
              type="password"
              :readOnly="isRead"
              v-decorator="[
                'confirmPSW',
                {
                  rules: [
                    { required: true, message: '请再次输入新密码' },
                    { min: 6, message: '密码不能少于6位' },
                    { max: 16, message: '密码不能多于16位' },
                    {
                      pattern: /^[a-zA-Z0-9._-]{6,16}$/,
                      message: '密码格式不正确'
                    }
                  ]
                }
              ]"
              placeholder="请再次输入新密码"
              @focus="focusEvent"
            ></a-input-password>
          </a-form-item>

          <a-form-item label="验证码" v-bind="formItemLayout">
            <a-input
              @keyup.native="
                $event.target.value = $event.target.value.replace(/[, ]/g, '')
              "
              v-decorator="[
                'verify',
                { rules: [{ required: true, message: '请输入验证码' }] }
              ]"
              placeholder="请输入验证码"
            ></a-input>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- '注册'弹窗 -->
      <a-modal
        title="注册"
        v-model="registerVisible"
        :maskClosable="false"
        @ok="register"
        @cancel="handleCancel"
      >
        <a-form :form="registerForm" @submit="handleSubmit">
          <a-form-item v-bind="formItemLayout" label="E-mail">
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
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="密码" has-feedback>
            <a-input-password
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '密码不能为空'
                    },
                    {
                      min: 6,
                      message: '密码至少6位'
                    },
                    {
                      max: 16,
                      message: '密码至多16位'
                    },
                    {
                      pattern: /^[a-zA-Z0-9._-]{6,16}$/,
                      message: '密码格式不正确'
                    }
                  ]
                }
              ]"
              type="password"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="确认密码" has-feedback>
            <a-input-password
              v-decorator="[
                'confirm',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入确认密码'
                    },
                    {
                      validator: compareToFirstPassword
                    }
                  ]
                }
              ]"
              type="password"
              @blur="handleConfirmBlur"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="手机号">
            <a-input
              v-decorator="[
                'phone',
                {
                  rules: [{ required: true, message: '请输入手机号' }]
                }
              ]"
              style="width: 100%"
            >
              <a-select
                slot="addonBefore"
                v-decorator="['prefix', { initialValue: '86' }]"
                style="width: 70px"
              >
                <a-select-option value="86"> +86 </a-select-option>
              </a-select>
            </a-input>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="姓名">
            <a-input
              v-decorator="[
                'realName',
                {
                  rules: []
                }
              ]"
            >
            </a-input>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="用户名">
            <a-input
              v-decorator="[
                'username',
                {
                  rules: [
                    {
                      required: true,
                      message: '用户名不能为空'
                    },
                    {
                      max: 50,
                      message: '最多输入50个字'
                    }
                  ]
                }
              ]"
            >
            </a-input>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="公司名">
            <a-input
              v-decorator="[
                'company',
                {
                  rules: [
                    {
                      max: 50,
                      message: '最多输入50个字'
                    }
                  ]
                }
              ]"
            >
            </a-input>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <!-- 底部 -->
    <ai-footer />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AiFooter from "@/components/Footer.vue";
import { cloneDeep } from "lodash";

import LoginService from "@/service/login";
import UserService from "@/service/user";
import Register from "./Register.vue"; // 注册页面
import cache from "@/utils/cache";
const loginService = LoginService.getLoginService();
const userService = UserService.getUserService();

@Component({
  components: {
    Register,
    AiFooter
  }
})
export default class Login extends Vue {
  form: any = {};
  forgotForm: any = {};
  registerForm: any = {};

  formItemLayout: any = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };

  verifyCode: string = "";
  forgotVisible: boolean = false;
  registerVisible: boolean = false;
  confirmDirty: boolean = false;
  verificationCode: boolean = true; // 获取验证码
  count: number = 0;
  timer: any = null;
  isRead: boolean = true;

  created() {
    this.form = this.$form.createForm(this, {});
    this.forgotForm = this.$form.createForm(this, {});
    this.registerForm = this.$form.createForm(this, {});
    this.refreshVerifyCode();
  }

  mounted() {
    this.$store.state.user.username = null;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      const param = cloneDeep(values);
      param.code = values.code.trim();
      if (err) return;
      this.handleLogin(param);
    });
  }

  // 登录
  async handleLogin(user: any) {
    try {
      this.$message.loading("正在登录中");
      const response = await loginService.login(user);
      this.$message.destroy();
      if (!response) {
        this.$message.error("用户名或密码不正确!");
        return;
      }
      this.$message.success("登录成功");
      console.log("登录成功了", this.$route.fullPath);
      if (
        this.$route.query.prePage == "templateList" &&
        this.$route.query.prePage
      ) {
        this.$router.push("/main/OCR/templateList");
      } else {
        // 有参数就跳转到之前的页面，没有就跳到首页
        if (this.$route.query.prePage !== undefined) {
          this.$router.push({
            path: `${this.$route.query.prePage}`
          });
        } else {
          this.$router.push("/main/document/HomePage");
        }
      }
    } catch (err) {
      this.refreshVerifyCode();
    }
  }

  // 登录（旧方法）
  async handleLogin1(user: any) {
    try {
      this.$message.loading("正在登录中");
      const response = await loginService.login(user);
      this.$message.destroy();
      if (!response) {
        this.$message.error("用户名或密码不正确!");
        return;
      }
      this.$message.success("登录成功");
      // this.$router.push("/main/user/info");
      // this.$router.push("/main/document/ApiPower/facePage/1");
      // 对话流平台退出登录后跳转至对话流平台
      // let lastpath = cache.localGet("lastpath");
      // if (lastpath) {
      //   const token = cache.localGet("ai-front-token");
      //   const username = cache.localGet("username");
      //   let newtoken = window.btoa(token);
      //   // window.location.href =
      //   //   "https://px-dialogue-frontend-px-dialogue.test.dm-ai.cn" +
      //   //   lastpath +
      //   //   "?token=" +
      //   //   newtoken +
      //   //   "&username=" +
      //   //   username;
      //   window.location.href =
      //     "http://192.168.4.143:8080/#" +
      //     lastpath +
      //     "?token=" +
      //     newtoken +
      //     "&username=" +
      //     username;
      //   cache.localRemove("lastpath");
      //   return;
      // }
      if (
        this.$route.query.prePage == "templateList" &&
        this.$route.query.prePage
      ) {
        this.$router.push("/main/OCR/templateList");
      } else {
        // 有参数就跳转到之前的页面，没有就跳到首页
        if (this.$route.query.prePage !== undefined) {
          this.$router.push({
            path: `${this.$route.query.prePage}`
          });
        } else {
          this.$router.push("/main/document/HomePage");
        }
      }
    } catch (err) {
      this.refreshVerifyCode();
      if (err.message !== "账号被禁用") {
        // this.feedbackSuccess = false // 登录失败
      }
      // this.$message.destroy();
      // if (err.message === "Request failed with status code 400") {
      //   this.$message.error("用户名或密码不正确!");
      // } else if (err.message !== "调用外部接口失败") {
      //   this.$message.error(err.message);
      // }
    }
  }

  async refreshVerifyCode() {
    this.verifyCode = `/v1/user-manager/user/verifyCode?t=${+new Date()}`;
  }

  async sendMail() {
    const values = this.forgotForm.getFieldsValue();
    const { email } = values;
    if (!email) {
      this.$message.warning("邮箱地址不能为空");
      return;
    }
    // 增加写死的参数：isCheck:true
    const response = await userService.sendMail({ email, isCheck: true });
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

  showForgotModal() {
    this.forgotVisible = true;
    this.isRead = true;
  }

  focusEvent() {
    this.isRead = false;
  }

  forgotPassword() {
    this.forgotForm.validateFields(async (err: any, values: any) => {
      if (err) return;
      if (values.passwordNew !== values.confirmPSW) {
        this.$message.warning("两次输入的密码不一致");
        return;
      }
      values.password = values.passwordNew;
      values.verify = values.verify.trim();
      delete values.passwordNew;
      delete values.confirmPSW;
      const response = await userService.changePwd(values);
      if (response) {
        this.$message.success("修改密码成功");
        this.forgotForm.resetFields();
        location.reload();
        this.forgotVisible = false;
      }
    });
  }

  handleConfirmBlur(e: any) {
    const value = e.target.value;
    this.confirmDirty = this.confirmDirty || !!value;
  }

  compareToFirstPassword(rule: any, value: any, callback: any) {
    const form = this.registerForm;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  }

  handleOperate() {
    return false;
  }

  // '注册'的接口
  async register(e: any) {
    this.registerForm.validateFields(async (err: any, values: any) => {
      if (err) return;
      if (values.realName == "") {
        delete values.realName;
      }
      if (values.company == "") {
        delete values.company;
      }
      delete values.confirm;
      const response = await loginService.regist(values);
      if (response) {
        this.$message.success("注册成功");
        location.reload();
        this.registerVisible = false;
      }
    });
  }

  // 关闭注册的弹窗：清空内容
  handleCancel(e: any) {
    this.registerForm.resetFields();
    this.registerVisible = false;
  }

  // 关闭忘记密码的弹窗：清空内容
  forgotHandleCancel(e: any) {
    this.forgotForm.resetFields();
    this.forgotVisible = false;
  }

  // 跳到注册页面
  registerPage() {
    this.$router.push("/Register");
  }

  // 跳到首页
  homePage() {
    this.$router.push("/main/document/HomePage");
  }
}
</script>

<style scoped lang="scss">
@import "./css/Index.scss";
</style>
