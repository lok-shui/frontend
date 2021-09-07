<template>
  <div class="tabWrap">
    <!-- '使用场景'组件 -->
    <a-tabs :default-active-key="0">
      <a-tab-pane
        v-for="(item, index) in uniqueData"
        :key="index"
        :tab="item.industryClass"
      >
        <div class="tabContent">
          <div class="boxShadow">
            <div class="rightCard">
              <div
                class="columns"
                v-for="(sec, skey) in item.seconds"
                :key="skey"
              >
                <div class="theme">
                  {{ sec.theme }}
                  <span
                    @click="toIndustryDetail(sec)"
                    v-if="sec.industryId && sec.industryName"
                    >查看详情 <a-icon type="right-circle"
                  /></span>
                </div>
                <div class="text">{{ sec.content }}</div>
              </div>
            </div>
          </div>

          <div class="imgs">
            <img :src="item.seconds[0].path" alt="" />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { cloneDeep } from "lodash";
@Component
export default class Scenary extends Vue {
  @Prop({}) scenary!: any;
  obj: any[] = [];
  uniqueData: any[] = [];

  created() {
    console.log("传进来的scenary", this.scenary);
  }

  mounted() {
    const cloneData: any = cloneDeep(this.scenary);
    // 行业分类industryClass有重复的， 要去重
    // 把源数据先变成目标数据的规则
    let oldDataRule: any = [];
    cloneData.forEach((el: any) => {
      let oldObj: any = {
        industryClass: el.industryClass,
        seconds: []
      };
      let cityObj: any = {
        content: el.content,
        industryId: el.industryId,
        industryName: el.industryName,
        id: el.id,
        path: el.path,
        theme: el.theme,
        sid: el.sid
      };
      oldObj.seconds.push(cityObj);
      oldDataRule.push(oldObj);
    });

    /**
     * 先去重，后合并
     * 1、源数据去重
     * 2、把去重后的数据和源数据中相同name的数据合并citys
     */
    var newObj: any = {};
    oldDataRule.forEach((el: any, i: number) => {
      if (!newObj[el.industryClass]) {
        this.uniqueData.push(el);
        newObj[el.industryClass] = true;
      } else {
        this.uniqueData.forEach((el: any) => {
          if (el.industryClass === oldDataRule[i].industryClass) {
            el.seconds = el.seconds.concat(oldDataRule[i].seconds);
            // el.seconds = [...el.seconds, ...oldDataRule[i].seconds]; // es6语法
          }
        });
      }
    });
    console.log("去重后的newData", this.uniqueData);
  }

  // 跳到行业应用页面
  toIndustryDetail(item: any) {
    this.$router.push({
      path: "/main/document/ApplicationPage/",
      query: {
        name: item.industryName
      }
    });
  }
}
</script>
<style lang="scss" scoped>
@import "../css/Scenary.scss";
</style>
