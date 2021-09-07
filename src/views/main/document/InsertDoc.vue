<template>
  <div class="apipage">
    <doc v-if="doc" :doc="doc" />

    <!-- API文档页面start ↓↓ -->
    <div v-else class="pageWrap">
      <div class="bgColor">
        <!-- 侧边二级菜单 -->
        <div class="apiWrapper">
          <div class="siderList" v-for="(item, index) in menuName" :key="index">
            <div class="titlename">{{ item.name }}</div>
            <div v-for="(s, i) in item.interfaces" :key="i">
              <div
                :class="itemIndex == s.apiId ? 'activeItem' : 'item'"
                @click="linkDetail(s.apiId, $event, index)"
              >
                {{ s.apiName }}
              </div>
            </div>
          </div>
        </div>
        <!-- 右边对应的内容 -->
        <div class="apiContent">
          <h1>API规范</h1>
          <h2>名称</h2>
          <div class="txtwrap">{{ listDetail.name }}</div>
          <h2>描述</h2>
          <div class="txtwrap">{{ listDetail.desc }}</div>
          <h3>调用URL</h3>
          <div class="txtwrap">{{ listDetail.url }}</div>
          <h3>请求方法</h3>
          <div class="txtwrap">
            <div v-if="(listDetail.method = 0)">GET</div>
            <div v-else-if="(listDetail.method = 1)">POST</div>
            <div v-else-if="(listDetail.method = 2)">PUT</div>
            <div v-else-if="(listDetail.method = 3)">PATCH</div>
            <div v-else-if="(listDetail.method = 4)">DELETE</div>
          </div>
          <h3>请求头参数</h3>
          <a-table
            :columns="headers"
            :dataSource="headersData"
            rowKey="id"
            :pagination="false"
          >
          </a-table>
          <h3>请求body属性</h3>
          <a-table
            :columns="bodies"
            :dataSource="bodiesData"
            rowKey="id"
            :pagination="false"
          >
          </a-table>

          <h3>成功返回示例</h3>
          <pre
            v-html="highlightCode(listDetail.success)"
            class="codeStyle"
          ></pre>
          <h3 style="margin-top: 25px">失败返回示例</h3>
          <pre
            v-html="highlightCode(listDetail.fail)"
            class="codeStyle"
            style="margin-bottom: 25px"
          ></pre>
          <h3>返回值说明</h3>
          <a-table
            :columns="returnExplain"
            :dataSource="returnDatas"
            rowKey="id"
            :pagination="false"
          >
          </a-table>
          <h3>当前API特有的ERROR_MESSAGE</h3>
          <a-table
            :columns="current"
            :dataSource="codeData"
            rowKey="id"
            :pagination="false"
          >
          </a-table>
          <h3>调用示例</h3>
          <div class="txtwrap">{{ listDetail.testscript }}</div>
          <h3>客户端代码</h3>
          <div class="codeStyle">
            <!-- 判断是不是空数组 -->
            <div
              v-if="
                Array.prototype.isPrototypeOf(listDetail.clientcodes) &&
                  listDetail.clientcodes.length !== 0
              "
            >
              <div v-for="(item, index) in listDetail.clientcodes" :key="index">
                <!-- <h4>
                  <b>{{ item.clientName }}</b>
                </h4> -->
                <div>
                  <pre v-html="highlightCode(item.downloadUrl)"></pre>
                  <pre v-html="highlightCode(item.fileName)"></pre>
                  <pre v-html="highlightCode(item.fileText)"></pre>
                </div>
              </div>
            </div>
            <div v-else>暂无数据</div>
          </div>
        </div>
      </div>
    </div>
    <!-- API文档页面end ↑↑-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Doc from "./components/doc.vue";
import document from "./data";
import DocService from "@/service/doc";
import { cloneDeep } from "lodash";
import hljs from "highlight.js";
import "highlight.js/styles/tomorrow.css";

const docService = DocService.getDocService();

@Component({
  components: {
    Doc
  }
})
export default class InsertDoc extends Vue {
  get docId() {
    return this.$route.params.id;
  }

  get doc() {
    const id = +this.docId;
    return document[id] || null;
  }

  get getApiId() {
    return this.$route.query.apiId;
  }

  menuName: Array<any> = [];
  itemIndex: number = 0;
  headers: any = [
    {
      title: "参数名",
      dataIndex: "key"
    },
    {
      title: "示例",
      dataIndex: "value"
    },
    {
      title: "参数说明",
      dataIndex: "desc"
    }
  ];
  bodies: any = [
    {
      title: "属性名",
      dataIndex: "name"
    },
    {
      title: "类型",
      dataIndex: "type"
    },
    {
      title: "属性说明",
      dataIndex: "desc"
    },
    {
      title: "是否必选"
    }
  ];
  clientCode: any = [
    {
      title: "客户端名称",
      dataIndex: "name",
      width: 180
    },
    {
      title: "状态码",
      dataIndex: "codes",
      width: 500,
      scopedSlots: { customRender: "stateCode" }
    }
  ];
  returnExplain: any = [
    {
      title: "参数名",
      dataIndex: "name"
    },
    {
      title: "参数类型",
      dataIndex: "type"
    },
    {
      title: "说明",
      dataIndex: "desc"
    }
  ];
  current: any = [
    {
      title: "状态码",
      dataIndex: "code"
    },
    {
      title: "错误信息",
      dataIndex: "msg"
    },
    {
      title: "说明",
      dataIndex: "desc"
    }
  ];

  headersData: any = []; //请求头数据
  bodiesData: any = []; // 请求体数据
  clientData: any = []; // 客户端代码
  returnDatas: any = []; // 返回值说明
  codeData: any = []; // 当前api持有的error_message
  listDetail: any = {};
  firstId: any = undefined;
  serviceId: number = 0;
  highlightCode(code: string) {
    return code ? hljs.highlightAuto(code).value : "";
  }
  created() {
    this.getInterfaceList();
    // if (this.$route.params.id) {
    //   this.serviceId = Number(this.$route.params.id);
    //   this.linkDetail(this.serviceId);
    // }
  }
  // @Watch("getApiId", { deep: true })
  // handleChange() {
  //   if (this.$route.query.apiId !== undefined) {
  //     let getApiId = this.$route.query.apiId;
  //     this.itemIndex = Number(getApiId);
  //     this.getInterfaceDetail(this.itemIndex);;
  //   }
  // }

  mounted() {
    // if (this.$route.params.id) {
    //   this.itemIndex = Number(this.$route.params.id);
    // } else {
    //   let getApiId = this.$route.query.apiId;
    //   this.itemIndex = Number(getApiId);
    // }
    let getApiId = this.$route.query.apiId;
    this.itemIndex = Number(getApiId);
  }

  // api页面的useful-list接口
  async getInterfaceList() {
    const response = await docService.getInterfaceList();
    if (!response) return;
    this.menuName = cloneDeep(response);
    // 设置左边菜单栏显示默认值

    if (this.$route.query.apiId !== undefined) {
      const a = Number(this.getApiId);
      this.getInterfaceDetail(a);
    } else {
      // 无apiId时调默认的第一个
      if (this.menuName[0].interfaces.length !== 0) {
        this.firstId = this.menuName[0].interfaces[0].apiId;
        this.linkDetail(this.firstId);
      } else if (this.menuName[1].interfaces.length !== 0) {
        //默认的第一个为空调第二个
        this.firstId = this.menuName[1].interfaces[0].apiId;
        this.linkDetail(this.firstId);
      }
    }
    // if (this.$route.params.id) {
    //   this.getInterfaceDetail(this.serviceId);
    //   this.firstId = this.serviceId;
    //   this.linkDetail(this.firstId);
    // }
  }

  // 左边切换item项
  linkDetail(apiId: number) {
    this.itemIndex = apiId;
    const id = String(apiId);
    this.getInterfaceDetail(apiId);
  }

  // 右边的详情内容
  async getInterfaceDetail(id: any) {
    const response = await docService.getInterfaceDetail(id);
    this.listDetail = cloneDeep(response);
    const {
      headers,
      bodies,
      clientcodes,
      codes,
      returnDatas
    } = this.listDetail;
    this.headersData = headers;
    this.bodiesData = bodies;
    this.clientData = clientcodes;
    this.returnDatas = returnDatas;
    this.codeData = codes;
  }
}
</script>

<style lang="scss" scoped>
@import "./css/InsertDoc.scss";
</style>
