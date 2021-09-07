<template>
  <div>
    <doc v-if="doc" :doc="doc" />
    <div v-else>暂无内容</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Doc from "./components/doc.vue";
import DocService from "@/service/doc";

const docService = DocService.getDocService();

@Component({
  components: {
    Doc
  }
})
export default class InterfaceDoc extends Vue {
  doc: any = {};

  requestMethods: any = {
    0: "GET",
    1: "POST",
    2: "PUT",
    3: "PATCH",
    4: "DELETE"
  };

  @Watch("$route.params.id")
  handleRouteChange() {
    const id = this.$route.params.id;
    this.getInterfaceDetail(id);
  }

  created() {
    const id = this.$route.params.id;
    this.getInterfaceDetail(id);
  }

  async getInterfaceDetail(id: any) {
    const response = await docService.getInterfaceDetail(id);
    // console.log(response)
    this.doc = {
      title: response.name,
      content: [
        {
          title: "描述",
          key: "1",
          children: [
            {
              key: "1.1",
              type: "text",
              text: response.desc
            }
          ]
        },
        {
          title: "调用URL",
          key: "2",
          children: [
            {
              key: "2.1",
              type: "code",
              code: `${response.address}${response.url}`
            }
          ]
        },
        {
          title: "请求方法",
          key: "3",
          children: [
            {
              key: "3.1",
              type: "text",
              text: this.requestMethods[response.method]
            }
          ]
        },
        {
          title: "请求头参数",
          key: "4",
          children: [
            {
              key: "4.1",
              type: "table",
              rowKey: "id",
              tableColumns: [
                { title: "参数名", dataIndex: "key" },
                { title: "示例", dataIndex: "value" },
                { title: "参数说明", dataIndex: "desc" }
              ],
              tableData: response.headers
            }
          ]
        },
        {
          title: "请求body属性",
          key: "5",
          children: [
            {
              key: "5.1",
              type: "table",
              rowKey: "id",
              tableColumns: [
                { title: "属性名", dataIndex: "name" },
                { title: "类型", dataIndex: "type" },
                { title: "属性说明", dataIndex: "desc" },
                { title: "是否必选", dataIndex: "required" }
              ],
              tableData: response.bodys.map((item: any) =>
                Object.assign(item, { required: item.required ? "是" : "否" })
              )
            }
          ]
        },
        {
          title: "成功返回值示例",
          key: "6",
          children: [
            {
              key: "6.1",
              type: "code",
              code: response.success
            }
          ]
        },
        {
          title: "失败返回值示例",
          key: "7",
          children: [
            {
              key: "7.1",
              type: "code",
              code: response.fail
            }
          ]
        },
        {
          title: "当前API特有的ERROR_MESSAGE",
          key: "8",
          children: [
            {
              key: "8.1",
              type: "table",
              rowKey: "id",
              tableColumns: [
                { title: "状态码", dataIndex: "code" },
                { title: "错误信息", dataIndex: "msg" },
                { title: "说明", dataIndex: "desc" }
              ],
              tableData: response.codes
            }
          ]
        }
      ]
    };
  }
}
</script>

<style lang="scss" scoped></style>
