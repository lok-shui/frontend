<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class School extends Vue {}
</script>

<style scoped lang="scss">
.document-contain {
  background-color: #ffffff;
  padding: 48px 55px;
}
</style>
