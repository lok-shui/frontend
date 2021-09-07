<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class OCR extends Vue {
  @Watch("$route")
  routechange(to: any, from: any, next: any) {
    // if (to.name !== from.name) {
    //   this.$router.go(0);
    // }
  }
}
</script>

<style scoped lang="scss"></style>
