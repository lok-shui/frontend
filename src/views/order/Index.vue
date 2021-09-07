<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
@Component
export default class Order extends Vue {}
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
}
</style>
