<template>
  <div class="selection">
    <a-select
      :placeholder="item.name"
      style="width: 180px"
      @change="handleChange"
      v-for="(item, key) in selectdata"
      :key="key"
    >
      <a-select-option :value="i" v-for="(i, k) in item.select" :key="k">
        {{ i }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
@Component
export default class Select extends Vue {
  @Prop() selectdata!: any;
  @Emit("changeselect") send(select: string) {}
  created() {}
  handleChange(value: any) {
    console.log(value);
    this.send(value);
  }
}
</script>

<style lang="scss" scoped>
/deep/.ant-select {
  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
