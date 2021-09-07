<template>
  <div class="user-contain">
    <div class="tit">消息通知</div>
    <a-table
      :columns="columns"
      :data-source="data"
      :expandIconAsCell="false"
      :expandIconColumnIndex="3"
    >
      <a slot="action">Delete</a>
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        {{ record.description }}
      </p>
      <template slot="expandIcon" ref="expandIcon">
        <a-icon type="up" />
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UserService from "@/service/user";
import { cloneDeep } from "lodash";

const userService = UserService.getUserService();

@Component
export default class UserInfo extends Vue {
  columns: Array<any> = [
    { title: "消息标题", dataIndex: "name", key: "name" },
    { title: "时间", dataIndex: "age", key: "age" },
    { title: "类型", dataIndex: "address", key: "address" },
    { title: "", dataIndex: "icon" }
  ];
  data: Array<any> = [
    {
      key: 1,
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      description:
        "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
    },
    {
      key: 2,
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      description:
        "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
    },
    {
      key: 3,
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
      description:
        "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
    }
  ];
  created() {}
  expandIcon(props: any) {
    console.log(props);
    // if (props.length > 0) {
    //   if (props.expanded) {
    //     return (
    //       <a-icon
    //         type="down"
    //         onClick={(e) => {
    //           props.onExpand(props.record, e);
    //         }}
    //       />
    //     );
    //   } else {
    //     return (
    //       <a-icon
    //         type="down"
    //         onClick={(e) => {
    //           props.onExpand(props.record, e);
    //         }}
    //       />
    //     );
    //   }
    // } else {
    //   return (
    //     <a-icon
    //       type="down"
    //       onClick={(e) => {
    //         props.onExpand(props.record, e);
    //       }}
    //     />
    //   );
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "./user.scss";
.tit {
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 1);
  line-height: 24px;
}
</style>
