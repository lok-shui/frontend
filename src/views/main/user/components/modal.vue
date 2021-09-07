<template>
  <div>
    <a-modal :visible="visible" @cancel="handleCancel" class="modal">
      <img :src="imgSrc" alt="" />
      <div v-if="message == '应用创建成功' || message == '应用编辑成功'">
        <p>{{ message }}</p>
        <div>
          <a-button @click="tousedetail" class="btn"> 应用详情 </a-button>
          <!-- <a-button class="btn" @click="lookthis">查看文档</a-button> -->
          <a-button class="redbtn" @click="handleOk"> 确定 </a-button>
        </div>
      </div>
      <div v-else-if="message == '您可以通过提交工单来升级额度或续费'">
        <p class="p">{{ message }}</p>
        <a-button class="redbtn" @click="toworker"> 提交工单 </a-button>
      </div>
      <div v-else>
        <p class="p">{{ message }}</p>
        <a-button class="redbtn" @click="confirmOk"> 确定 </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import cache from "@/utils/cache";
import UserService from "@/service/user";
const userService = UserService.getUserService();
@Component
export default class Select extends Vue {
  @Prop() visible!: boolean;
  @Prop() imgSrc?: any;
  @Prop() message?: any;
  @Prop() serviceId?: any;
  @Emit("changevisible") send(visible: boolean) {}
  @Emit("createUseList") create() {}
  @Emit("getNewWorkOrder") getNewWorkOrder() {}
  confirmLoading: boolean = false;
  createfirst: number = 0;
  created() {}
  handleCancel(e: any) {
    if (this.message == "应用创建成功" || this.message == "应用编辑成功") {
      this.$router.push("/main/user/uselist");
    }
    this.send(false);
  }
  // 创建成功后点击查看应用详情
  async tousedetail() {
    if (this.$route.params.id == undefined) {
      const params = {
        page: 1,
        per_page: 1,
        order: "desc",
        sortBy: "createTime"
      };
      const useId = cache.localGet("ai-front-id");
      const useList = await userService.getUseLists(useId, params);
      const newAppid = useList.data.data[0].id;
      this.$router.push("/main/user/usedetails/" + newAppid);
    } else {
      this.$router.push("/main/user/usedetails/" + this.$route.params.id);
    }
  }
  // 点击确定跳转至应用列表
  handleOk(e: any) {
    this.confirmLoading = true;
    setTimeout(() => {
      this.visible = false;
      this.confirmLoading = false;
      this.$router.push("/main/user/uselist");
    }, 1000);
  }
  // 确认创建
  confirmOk() {
    this.createfirst++;
    if (this.createfirst > 1) return;
    if (this.message == "确认取消吗") {
      this.$router.back();
      return;
    }
    this.create();
  }
  // 续费升级额度
  toworker() {
    if (this.$route.meta.openKeys == 0) {
      this.getNewWorkOrder();
    } else {
      this.$router.push("/main/user/WorkOrderNew");
    }
  }
  lookthis() {
    this.$router.push("/main/document/insertDoc/4");
  }
}
</script>

<style lang="scss" scoped>
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-modal-content {
  width: 352px;
  height: 205px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
/deep/.ant-modal-body {
  text-align: center;
  p {
    font-size: 18px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    margin: 17px 0 24px;
  }
  .btn {
    margin: 0 16px;
  }
  .p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
  .redbtn {
    background: rgba(220, 8, 22, 1);
    color: rgba(255, 255, 255, 1);
  }
}
</style>
