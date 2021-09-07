<template>
  <div class="bgColor">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
@Component
export default class Confirm extends Vue {}
</script>

<style lang="scss" scoped>
.bgColor {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(240, 245, 255, 1) 0%,
    rgba(249, 251, 255, 1) 100%
  );
  display: flex;
  justify-content: center;
}
</style>
