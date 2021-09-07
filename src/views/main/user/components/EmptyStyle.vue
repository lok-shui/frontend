<template>
  <div class="empty">
    <a-empty
      :image-style="{
        height: '152px'
      }"
    >
      <span slot="description">
        <p class="msg">您尚未开通服务</p>
        <p class="news">
          提交申请，我们专家会尽快与您联系！并为您提供需要的解决方案。
        </p></span
      >
      <a-button class="btn" @click="toworker"> 立即申请 </a-button>
    </a-empty>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
@Component
export default class Empty extends Vue {
  toworker() {
    this.$router.push("WorkOrderNew");
  }
}
</script>

<style lang="scss" scoped>
.empty {
  width: 100%;
  text-align: center;
  .msg {
    font-size: 18px;
    font-weight: 700;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
  }
  .news {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
  }
  .btn {
    background: rgba(220, 8, 22, 1);
    color: rgba(255, 255, 255, 1);
  }
}
</style>
