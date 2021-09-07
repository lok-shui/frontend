<template>
  <div>
    <a-form-item :label="name" overlayClassName="RangePicker">
      <a-range-picker @change="onChange" allowClear
        ><a-icon slot="suffixIcon" type="schedule" />
      </a-range-picker>
    </a-form-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
@Component
export default class Select extends Vue {
  @Prop({}) name?: any;
  @Emit("dateChange") send(date: any) {}
  created() {}
  onChange(date: any) {
    this.send(date);
  }
}
</script>

<style lang="scss" scoped>
/deep/.ant-form-item {
  display: flex;
  margin-right: 16px;
  margin-bottom: 0;
  width: 256px;
}
</style>
