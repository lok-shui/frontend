<template>
  <div class="empty">
    <a-empty
      :image-style="{
        height: '152px'
      }"
    >
      <span slot="description">
        <p class="news">暂未有服务使用记录</p>
      </span>
    </a-empty>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
@Component
export default class Empty extends Vue {}
</script>

<style lang="scss" scoped>
.empty {
  width: 100%;
  text-align: center;
  .news {
    font-size: px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.3);
    line-height: 22px;
  }
}
</style>
