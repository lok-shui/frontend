<template>
  <div class="bgColor">
    <div class="orderlogin">
      <div class="top">
        <!-- <div>
          <a-icon type="left" />
        </div> -->
        <div>登录</div>
        <!-- <div>
          <a-icon type="ellipsis" />
        </div> -->
      </div>
      <div class="login-contain">
        <div class="tittext">
          <b>欢迎登录</b>
          <div class="text">请使用DMAI-AI开放平台的账号登录</div>
          <div class="text content" @click="tohomepage">
            <div>还没有账号请点击</div>
            <div class="contentword">
              <span>AI开放平台</span
              ><img
                src="@/assets/order/icon_login_jump.png"
                alt=""
                width="24px"
              />
            </div>
            <div>跳转注册</div>
          </div>
        </div>
        <div class="login-form">
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
              <a-button type="primary" html-type="submit" class="login-btn">
                <a-icon type="arrow-right" />
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import LoginService from "@/service/login";
import UserService from "@/service/user";
const loginService = LoginService.getLoginService();
const userService = UserService.getUserService();
@Component
export default class Login extends Vue {
  form: any = {};
  modalFormPassword: any = {};
  modalFormRegister: any = {};
  confirmDirty: boolean = false;
  count: number = 0;
  timer: any = null;
  created() {
    this.form = this.$form.createForm(this, {});
  }
  mounted() {
    this.$store.state.user.username = null;
    console.log("登录页面", this.$store.state.user.username);
  }

  handleSubmit(e: any) {
    console.log(111111);
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      console.log("values", values);
      console.log("err", err);
      const param = cloneDeep(values);
      param.code = null;
      if (err) return;
      console.log(23233);
      console.log(param);

      this.handleLogin(param);
    });
  }

  //后续修改登陆接口
  async handleLogin(user: any) {
    console.log(11111);

    try {
      this.$message.loading("正在登录中");
      const response = await loginService.Loginnoverify(user);
      console.log(response);
      this.$message.destroy();
      if (!response) {
        this.$message.error("用户名或密码不正确!");
        return;
      }
      this.$message.success("登录成功");
      console.log("登录成功了", this.$store.state.user.username);
      this.$router.push("/order/confirm/orderconfirm");
    } catch (err) {
      console.log("err11", err);
      if (err.message !== "账号被禁用") {
        // this.feedbackSuccess = false // 登录失败
      }
      // this.$message.destroy();
      // console.log(err);
      // if (err.message === "Request failed with status code 400") {
      //   this.$message.error("用户名或密码不正确!");
      // } else if (err.message !== "调用外部接口失败") {
      //   this.$message.error(err.message);
      // }
    }
  }
  tohomepage() {
    this.$router.push("/main/document/HomePage");
  }
}
</script>

<style scoped lang="scss">
@import "@/views/order/confirm/order.scss";
.login-contain {
  background: url("../../assets/order/login_header_bg.png") no-repeat;
  background-size: cover;
}
</style>
