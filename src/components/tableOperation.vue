<template>
  <div>
    <a-button
      v-for="btnItem in btnGroups"
      :key="btnItem.type"
      class="operation-btn"
      type="link"
      @click="handleClick(btnItem.type, btnItem.confirm)"
    >
      <a-popconfirm
        v-if="btnItem.confirm"
        :title="btnItem.confirm"
        @confirm="handleClick(btnItem.type)"
      >
        <a>{{ btnItem.text }}</a>
      </a-popconfirm>
      <span v-else>{{ btnItem.text }}</span>
    </a-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class tableOperation extends Vue {
  @Prop() rowItem: any;
  @Prop() btnGroups?: any[];

  handleClick(operationType: string, stop: boolean) {
    if (stop) return;
    this.$emit("handleClick", { operationType, ...this.rowItem });
  }
}
</script>

<style lang="scss" scoped>
.operation-btn {
  padding: 0;
  color: #5580f5;
  margin-right: 12px;
}
</style>
