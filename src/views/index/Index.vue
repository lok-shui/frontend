<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoginService from "@/service/login";

const loginService = LoginService.getLoginService();
@Component
export default class Index extends Vue {
  created() {
    const path = this.$route.path;
    console.log(path);
    if (path.lastIndexOf("logout") !== -1) {
      loginService.logout();
    } else {
      loginService.loginByDmid();
    }
  }
}
</script>

<style lang="scss" scoped></style>
