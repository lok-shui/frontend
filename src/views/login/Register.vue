<template>
  <div class="register">
    <div class="topBar">
      <div class="logoWrap">
        <div class="logoBox" @click="homePage">
          <img src="@/assets/images/v2/DAIP_logo.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="registerContent">
      <div class="stepStripe">
        <a-steps :current="current">
          <a-step>
            <template slot="title"> 账号信息 </template>
          </a-step>
          <a-step title="邮箱激活" />
          <a-step title="注册成功" />
        </a-steps>
      </div>
      <div v-show="current == 0" class="firstStep">
        <a-form :form="firstStepForm" @submit="handleSubmit">
          <a-form-item label="E-mail">
            <a-input
              placeholder="请输入"
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
          <a-form-item label="密码" has-feedback>
            <a-input-password
              placeholder="请输入"
              autocomplete="new-password"
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
          <a-form-item label="确认密码：" has-feedback>
            <a-input-password
              placeholder="请输入"
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
          <a-form-item label="手机号">
            <a-input
              placeholder="请输入"
              v-decorator="[
                'phone',
                {
                  rules: [
                    { required: true, message: '请输入手机号' },
                    {
                      pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
                      message: '请输入正确的手机号'
                    }
                  ]
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
          <a-form-item label="姓名">
            <a-input
              placeholder="请输入"
              v-decorator="[
                'realName',
                {
                  rules: [
                    { required: true, message: '请输入用户名' },
                    {
                      pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
                      message: '不能包含特殊字符'
                    }
                  ]
                }
              ]"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="用户名">
            <a-input
              placeholder="请输入"
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
                    },
                    {
                      min: 2,
                      message: '不能少于2个字'
                    },

                    {
                      pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
                      message: '不能包含特殊字符'
                    }
                  ]
                }
              ]"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="公司名">
            <a-input
              placeholder="请输入"
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
      </div>

      <div class="secondSteps" v-show="current == 1">
        <div class="words">
          为确保账号信息无误，请前往注册邮箱查看最新邮件，且将验证码填入下方的输入框中。
        </div>
        <a-form :form="secondStepForm" class="secondsStyle">
          <a-form-item label="验证码">
            <a-input
              placeholder="请输入"
              class="inputs"
              @keyup.native="
                $event.target.value = $event.target.value.replace(
                  /^\s+|\s+$/gm,
                  ''
                )
              "
              v-decorator="[
                'verifyCode',
                {
                  rules: [
                    {
                      required: true,
                      message: '验证码不能为空'
                    }
                  ]
                }
              ]"
            />
            <a-button v-show="verificationCode" @click="sendMail"
              >获取验证码</a-button
            >
            <a-button disabled v-show="!verificationCode"
              >{{ sixtyCount }}s后可重新获取</a-button
            >
          </a-form-item>
        </a-form>
      </div>

      <div class="thirdStep" v-show="current == 2">
        <div class="iconWrap">
          <a-icon type="check" class="greenIcon" />
        </div>
        <div class="success">注册成功</div>
        <div class="link">
          <span>{{ tenCount }}</span
          >秒后自动跳转到登录前页面，点击下方按钮可直接跳转
        </div>
        <a-button class="backToBtn" @click="backToLogin">返回登录前页</a-button>
      </div>

      <div class="stepBtn" v-if="current <= 1">
        <a-button class="cancelBtn" @click="cancelStep">取消</a-button>
        <a-button class="nextBtn" @click="nextStep">下一步</a-button>
      </div>
    </div>
    <!-- 底部 -->
    <ai-footer />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AiFooter from "@/components/Footer.vue";
import LoginService from "@/service/login";
import UserService from "@/service/user";
import { cloneDeep } from "lodash";
const loginService = LoginService.getLoginService();
const userService = UserService.getUserService();
@Component({
  components: { AiFooter }
})
export default class Register extends Vue {
  current: number = 0;
  firstStepForm: any = {};
  secondStepForm: any = {};
  form: any = {};
  confirmDirty: boolean = false;
  cancelBtn: boolean = true;
  regiserParams: any = {};
  verificationCode: boolean = true; // 获取验证码
  tenCount: number = 0; // 步骤3里的10倒计时
  sixtyCount: number = 0;
  tenTimer: any = null;
  sixtyTimer: any = null;

  created() {
    this.firstStepForm = this.$form.createForm(this, {});
    this.secondStepForm = this.$form.createForm(this, {});
  }

  nextStep() {
    if (this.current > 2) {
      return;
    }
    switch (this.current) {
      case 0:
        this.firstStepForm.validateFields(async (err: any, values: any) => {
          if (err) return;
          if (values.realName == "") {
            delete values.realName;
          }
          if (values.company == "") {
            delete values.company;
          }
          this.regiserParams = cloneDeep(values);
          const param = {
            username: values.username,
            phone: values.phone,
            email: values.email
          };
          this.registerFirstStep(param);
        });
        break;
      case 1:
        this.secondStepForm.validateFields(async (err: any, value: any) => {
          if (err) return;
          this.regiserParams.verifyCode = value.verifyCode.trim();
          this.userRegister(this.regiserParams);
        });
        break;
    }
  }

  cancelStep() {
    switch (this.current) {
      case 0:
        this.$router.push("/login");
        break;
      case 1:
        this.current = 0;
        break;
    }
  }

  backToLogin() {
    this.$router.push("/login");
  }

  async registerFirstStep(params: any) {
    const response = await loginService.registerFirstStep(params);
    if (response) {
      this.current = 1;
    }
  }

  // '注册'的接口
  async userRegister(params: any) {
    const response = await loginService.userRegister(params);
    if (response) {
      this.$message.success("注册成功");
      this.current = 2;
      if (!this.tenTimer) {
        // 10秒后跳转到登录页
        this.tenCount = 10;
        this.tenTimer = setInterval(() => {
          if (this.tenCount > 0 && this.tenCount <= 10) {
            this.tenCount--;
          } else {
            clearInterval(this.tenTimer);
            this.tenTimer = null;
            this.$router.push("/login");
            location.reload();
          }
        }, 1000);
      }
    }
  }
  // 获取验证码
  async sendMail() {
    const values = this.firstStepForm.getFieldsValue();
    const { email } = values;
    if (!email) {
      this.$message.warning("email不能为空");
      return;
    }
    const response = await userService.sendMail({ email });
    if (response) {
      this.$message.success(response);
      if (!this.sixtyTimer) {
        this.sixtyCount = 60;
        this.verificationCode = false;
        this.sixtyTimer = setInterval(() => {
          if (this.sixtyCount > 0 && this.sixtyCount <= 60) {
            this.sixtyCount--;
          } else {
            this.verificationCode = true;
            clearInterval(this.sixtyTimer);
            this.sixtyTimer = null;
          }
        }, 1000);
      }
    }
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
    });
  }

  handleConfirmBlur(e: any) {
    const value = e.target.value;
    this.confirmDirty = this.confirmDirty || !!value;
  }

  compareToFirstPassword(rule: any, value: any, callback: any) {
    const form = this.firstStepForm;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  }

  // 跳到首页
  homePage() {
    this.$router.push("/main/document/HomePage");
  }
}
</script>

<style scoped lang="scss">
@import "./css/Register.scss";
</style>
