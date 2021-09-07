<template>
  <div v-if="doc" class="doc-contain">
    <div class="title">{{ doc.title }}</div>

    <div class="content-item" v-for="content in doc.content" :key="content.key">
      <div class="content-title">{{ content.title }}</div>
      <div class="item" v-for="item in content.children" :key="item.key">
        <div v-if="item.type === 'text'" class="text">{{ item.text }}</div>
        <div v-else-if="item.type === 'table'" class="table">
          <a-table
            :columns="item.tableColumns"
            :dataSource="item.tableData"
            :rowKey="item.rowKey || 'index'"
            :pagination="false"
          />
        </div>
        <div v-else-if="item.type === 'subTitle'" class="sub-title">
          {{ item.text }}
        </div>
        <div v-else-if="item.type === 'code'">
          <pre class="code" v-html="highlightCode(item.code)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import hljs from "highlight.js";

import "highlight.js/styles/tomorrow.css";

@Component
export default class Doc extends Vue {
  @Prop() doc: any;

  highlightCode(code: string) {
    return hljs.highlightAuto(code).value;
  }
}
</script>

<style lang="scss" scoped>
.doc-contain {
  text-align: left;
  width: 1131px;
  margin: 40px auto 200px auto;

  .title {
    font-size: 32px;
    line-height: 46px;
    margin-bottom: 42px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
  }

  .content-item {
    margin-bottom: 48px;

    .content-title {
      font-size: 24px;
      line-height: 34px;
      // margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
    }

    .item {
      margin-top: 16px;
    }

    .sub-title {
      padding-top: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
    }

    .text {
      width: 800px;
      word-wrap: break-word;
      font-size: 16px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.45);
    }

    .table {
      min-width: 800px;
      max-width: 1400px;
    }

    .code {
      min-width: 800px;
      max-width: 1400px;
      padding: 20px;
      background-color: #f6f6fb;
      border: 1px solid #d6dde6;
    }
  }
}
</style>
