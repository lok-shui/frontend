<template>
  <div class="imgIdentify">
    <div class="panelTab" v-if="facePage.length > 1">
      <div
        :class="tabIndex == index ? 'activeTab' : ''"
        v-for="(item, index) in facePage"
        :key="index"
        @click="changeTab(item, index)"
      >
        {{ item.interfaceName }}
      </div>
    </div>

    <div class="uploadWrap">
      <!-- 人脸关键点  人脸朝向 -->
      <div class="leftPart">
        <div class="imgContent">
          <!-- 缩略图  -->
          <div class="imgWrappers">
            <div
              v-for="(img, i) in imgList"
              :key="i"
              :class="activeIndex == i ? 'clickItem' : 'squer'"
              @click="changeImg(i, $event)"
            >
              <img :src="img.url" alt="缩略图" />
            </div>
          </div>
          <!-- 大图  -->
          <div class="largeImg">
            <a-spin :spinning="largeLoading" v-show="fail">
              <div class="limitWrap">
                <img
                  src="@/assets/images/v1/upload_failed_icon.png"
                  alt="上传失败"
                />
                <div class="failed">{{ failed }}</div>
                <div class="try">{{ again }}</div>
              </div>
            </a-spin>

            <a-spin :spinning="largeLoading" v-show="!fail">
              <div class="change">
                <img
                  :src="largeUrl"
                  ref="largeImg"
                  crossOrigin="Anonymous"
                  alt="大图"
                />
              </div>
            </a-spin>
          </div>
        </div>
        <div class="upload flexBetween">
          <a-input-search
            allowClear
            placeholder="请将网络图片URL粘贴到输入框"
            @search="checkUrl"
            ref="netUrl"
            enterButton="检测"
          />

          <span class="or">或</span>

          <span class="fileinput-button">
            <span>本地上传</span>
            <input
              type="file"
              @change="uploadImages($event)"
              accept=".jpg,.png,.jpeg"
            />
          </span>
        </div>
      </div>

      <!-- response数据 -->
      <div class="rightPart">
        <a-spin :spinning="responseloading">
          <div class="code">
            <div class="line">
              <span>Responses</span>
              <a-button @click="copyText">{{ btnTxt }}</a-button>
            </div>

            <pre
              class="dataWrap"
              v-if="JSON.stringify(responseData) !== '{}'"
              ref="pre"
              id="dataWrap"
            >
              <textarea id="abc" readonly ref="copy" v-model="textareaString" v-if="!showTextarea"></textarea>
              <div ref="copys" id="copys" v-if="showTextarea">{{ responseData }}</div>
            </pre>
            <pre class="dataWrap" v-else>
              <textarea name="" id="copy2" ref="copy2">无数据</textarea>
            </pre>
            <div class="errorTip" v-if="errorTip !== ''">{{ errorTip }}</div>
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios, { AxiosStatic } from "axios";
import { baseImage, jsonSource, fitImgSuffix } from "@/utils/publicJsEvent";
import { cloneDeep } from "lodash";

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
@Component({
  components: {}
})
export default class FaceLandmark extends Vue {
  @Prop({}) facePage!: any;

  get paramId() {
    return this.$route.params.id;
  }
  fade: boolean = false;
  textareaString: string = "";
  showTextarea: boolean = true;

  activeIndex: number = 0;
  largeImg: any = []; // 放大的图片
  largeLoading: boolean = false; // 大图的loading
  uploadBtn: string = "uploadBtn"; // '上传图片'按钮样式
  largeUrl: string = "";

  imgList: any[] = [];
  responseData: any = {}; // 展示接口返回的response
  responseloading: boolean = false;
  btnTxt: string = "一键复制";

  fail: boolean = false;
  failed: string = "URL图片获取失败";
  again: string = "请重新选择一张图片，并确保人脸正对画面";
  pageId: number = -1;
  errorTip: string = "";

  tabIndex: number = 0;
  tabUrl: string = ""; // 每个tab对应的接口url
  tabName: string = ""; // 每个tab对应的名字
  responseArray: any = [];

  @Watch("facePage", { deep: true })
  handleFacePage() {
    this.pageId = Number(this.$route.params.id);
    this.loadFace();
  }
  created() {}

  mounted() {
    this.loadFace();
  }

  loadFace() {
    console.log("传进来的facePagell", this.facePage);
    if (this.facePage.length !== 0) {
      if (this.facePage[0].photos) {
        this.imgList = cloneDeep(this.facePage[0].photos);
        this.changeImg(0, {});
      }
    } else {
      this.imgList = [];
      this.largeUrl = "";
      this.responseData = {};
    }
  }

  // 切换tab
  changeTab(item: any, index: number) {
    this.responseData = {};
    this.textareaString = "";
    this.activeIndex = 0;
    this.fail = false;
    this.tabIndex = index;
    this.largeUrl = item.photos[0].url;
    this.imgList = cloneDeep(item.photos);
    this.tabUrl = item.url;
    this.tabName = item.interfaceName;
    const txtUrl = jsonSource(this.largeUrl);
    this.txtData(txtUrl);
  }

  // 一键复制
  copyText() {
    // 判断是否为空对象
    if (JSON.stringify(this.responseData) !== "{}") {
      const inputC = document.getElementById("abc") as HTMLTextAreaElement;
      inputC.select();
      document.execCommand("Copy");
      this.$message.success("已复制！");
      this.btnTxt = "已复制";
      setTimeout(() => {
        this.btnTxt = "一键复制";
      }, 10000);
    } else {
      const text = this.$refs.copy2 as HTMLTextAreaElement;
      text.select();
      document.execCommand("Copy");
      this.$message.success("复制成功！");
    }
  }

  // 切换左边的缩略图（新方法，不请求算法接口）
  changeImg(index: number, event: any) {
    this.textareaString = "";
    this.responseData = {};
    this.showTextarea = true;
    this.fail = false;
    this.largeLoading = true;
    this.responseloading = true;
    this.activeIndex = index;

    const itemUrl = this.facePage[this.tabIndex].photos[this.activeIndex].url;
    this.largeUrl = itemUrl;
    // 是否有网络
    if (navigator.onLine) {
      this.txtData(jsonSource(itemUrl));
    } else {
      this.responseloading = false;
      this.largeLoading = false;
      this.fail = true;
      this.failed = "网络出小差了";
      this.again = "请检查网络后再试";
    }
  }

  // 解析新的文本url
  async txtData(url: string) {
    const res = await axios.get(url).then((res: any) => {
      if (res.data.code == undefined) {
        this.responseloading = false;
        this.largeLoading = false;
        this.fail = true;
        this.failed = "网络出小差了";
        this.again = "请检查网络后再试";
        this.$message.error("无响应数据");
        return;
      }
      let baseImg = res.data.data.image;
      if (baseImg) {
        const jsonData = res.data.data;
        this.responseData = JSON.parse(
          JSON.stringify(jsonData, (key: any, value: any) => {
            if (key == "image") {
              return undefined;
            } else {
              return value;
            }
          })
        );
        this.showTextarea = true;
        setTimeout(() => {
          // textarea的内容必须为string, 要一键复制得先把返回的数据转为字符串
          const pre: any = this.$refs.copys as HTMLPreElement;
          this.textareaString = pre.innerHTML;
          this.largeUrl = baseImg;
          this.largeLoading = false;
          this.responseloading = false;
          this.showTextarea = false;
        }, 0);
      } else {
        this.$message.error("没有图片");
      }
    });
  }

  checkUrl(inputUrl: any, event: any) {
    // this.fail = false;
    if (inputUrl == "" && event.target.type == "button") {
      this.$message.error("请输入图片的地址", 1);
      return;
    } else if (inputUrl == "" && event.target.type == "text") {
      return;
    } else if (!inputUrl.includes("http") || !inputUrl.includes("://")) {
      this.$message.error("您输入的地址错误，请重新输入.", 1);
      return;
    } else {
      //获取网络图片的名字
      let filename = inputUrl.substring(inputUrl.lastIndexOf("/") + 1);
      if (filename.lastIndexOf(".") == -1) {
        filename = "internet.jpg";
      } else if (fitImgSuffix(inputUrl, true)) {
        const errorMsg = fitImgSuffix(inputUrl, true);
        this.$message.error(`${errorMsg}`);
        return;
      }
      this.responseData = {};
      const imgparam = {
        dataType: "image/jpeg",
        dataField: "image_base64",
        remoteUrl: inputUrl
      };
      const imgparam2 = {
        dataType: "image/jpeg",
        dataField: "base64",
        remoteUrl: inputUrl,
        name: filename
      };
      if (this.facePage[0].interfaceName == "人脸朝向") {
        this.getAxios(imgparam2);
      } else {
        this.getAxios(imgparam);
      }
    }
  }

  getAxios(param: any) {
    this.fail = false;
    this.largeLoading = true;
    this.responseloading = true;
    JSON.stringify(this.responseData) == "{}";
    axios({
      method: "post",
      url: this.facePage[this.tabIndex].url,
      headers: {
        dmid: "b28847e4-6c1d-49d1-8172-05d3d1c83154",
        service: encodeURIComponent(this.facePage[0].interfaceName)
      },
      timeout: 1000 * 60,
      data: param
    })
      .then((res: any) => {
        if (res) {
          this.largeLoading = false;
          this.responseloading = false;
          if (res.data.code == 500 && res.data.error == "system error") {
            this.failed = "图片获取失败";
            this.again = "请重新选择图片";
            this.fail = true;
            this.showTextarea = true;
            this.responseData = String(res.data.error);
            return;
          } else if (
            res.data.data == null ||
            res.data.data == "please check return format"
          ) {
            this.failed = "未检测到人脸";
            this.again = "请重新选择一张图片，并确保人脸正对画面";
            this.fail = true;
            this.showTextarea = true;
            this.responseData = String(res.data.data);
            return;
          }

          if (res.data.data.face_bbox && res.data.data.face_bbox.length == 0) {
            this.errResponse(res, param);
            return;
          } else if (res.data.data.bboxes == []) {
            this.errResponse(res, param);
            return;
          } else if (this.facePage[0].interfaceName == "人脸框+人脸关键点") {
            if (res.data.data.bboxes !== []) {
              this.successResponse(res);
            }
          } else if (this.facePage[0].interfaceName == "人脸朝向") {
            if (
              res.data.data.face_bbox.length !== 0 &&
              res.data.data.pose_value.length !== 0
            ) {
              this.successResponse(res);
            } else {
              this.errResponse(res, param);
            }
          }
        }
      })
      .catch((error: any) => {
        let errorCode = error.toString();
        if (errorCode.indexOf("403") !== -1) {
          this.$message.error("您的操作过于频繁，请稍后再试");
          return;
        }
        this.largeLoading = false;
        this.responseloading = false;
        this.fail = true;
        this.failed = "网络出小差了";
        this.again = "请检查网络后再试";
      });
  }

  errResponse(res: any, param: any) {
    this.fail = true;
    if ("remoteUrl" in param) {
      if (res.data.data.image) {
        this.responseData = undefined;
        this.textareaString = "";
        this.failed = "非人脸图片";
        this.again = "请重新选择一张图片，并确保人脸正对画面";
      } else {
        this.failed = "图片获取失败";
        this.again = "请重新选择图片";
        this.responseData = undefined;
        this.textareaString = "";
      }
    } else if (res.data.data.image) {
      this.responseData = undefined;
      this.textareaString = "";
      this.failed = "非人脸图片";
      this.again = "请重新选择一张图片，并确保人脸正对画面";
    }
    this.responseData = res.data;
  }

  successResponse(res: any) {
    this.responseData = {};
    this.fail = false;
    this.largeUrl = res.data.data.image;
    // 过滤调image字段，不展示
    const ar = res.data;
    this.responseData = JSON.parse(
      JSON.stringify(ar, (key: any, value: any) => {
        if (key == "image") {
          return undefined;
        } else {
          return value;
        }
      })
    );
    this.showTextarea = true;
    setTimeout(() => {
      const pre: any = this.$refs.copys as HTMLPreElement;
      this.textareaString = pre.innerHTML;
      this.showTextarea = false;
    });
    this.activeIndex = -1;
  }

  uploadImages(event: any) {
    const targetFile = event.target.files[0];
    const size = targetFile.size;
    const values = event.target.value;
    const fileName = values
      .substring(values.lastIndexOf(".") + 1)
      .toLowerCase();

    // 只能上传jpg,png格式图片
    if (fileName !== "jpg" && fileName !== "jpeg") {
      this.$message.error("请上传jpg或jpeg格式图片");
      event.target.value = "";
      this.fail = false;
      this.activeIndex = -1;
      return false;
    }

    // 图片不能超过2M
    if (size / 1024 > 2024) {
      this.fail = true;
      this.activeIndex = -1;
      this.failed = "图片文件太大了";
      this.again = "请重新上传尺寸少于2M的图片";
      this.responseData = {};
      event.target.value = "";
      return false;
    } else {
      this.responseData = {};
      this.fail = false;
    }
    this.largeUrl = "";
    const name = event.target.files[0].name;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let self = this;
    reader.onload = (e: any) => {
      let result = e.target.result;
      const data = {
        image_base64: result
      };
      this.getAxios(data);
    };
    event.target.value = "";
  }
}
</script>
<style lang="scss" scoped>
@import "../css/sameCss.scss";
@import "../css/FaceLandmark.scss";
</style>
