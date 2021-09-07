<template>
  <div>
    <div class="imgIdentify">
      <!-- 文字识别组件（公式识别，中文识别，英文识别，中英文识别） -->
      <div class="panelTab">
        <div
          :class="tabIndex == index ? 'activeTab' : ''"
          v-for="(item, index) in identifyList"
          :key="index"
          @click="changeTab(item, index)"
        >
          {{ item.interfaceName }}
        </div>
      </div>

      <div class="panelItem">
        <div class="leftWrap">
          <div class="top">
            <div class="left">
              <div
                v-for="(list, count) in identifyList[tabIndex].photos"
                :key="count"
                :class="imgIndex == count ? smallActive : 'small'"
                @click="activeImg(count, list)"
              >
                <img :src="list.url" alt="缩略图" />
              </div>
            </div>
            <div class="center">
              <div class="ocrFailed" v-show="fail">
                <img
                  src="@/assets/images/v1/upload_failed_icon.png"
                  alt="上传失败"
                />
                <div class="ocrFail">{{ failed }}</div>
                <div class="ocrAagin">{{ again }}</div>
              </div>

              <div class="largeWrap" v-show="!fail">
                <a-spin :spinning="imgSpinning" tip="图片加载中...">
                  <img :src="largeUrl" crossOrigin="Anonymous" alt="大图" />
                </a-spin>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="bottomWrap">
              <a-input-search
                allowClear
                placeholder="请将网络图片URL粘贴到输入框"
                @search="onCheck"
                ref="netUrl"
                enterButton="检测"
                class="inputWrap"
              />

              <span class="orOcr">或</span>
              <span class="fileinput-button">
                <span>本地上传</span>
                <input
                  type="file"
                  ref="uploadImg"
                  accept=".jpg,.png,.jpeg"
                  @change="
                    uploadImages($event, identifyList[tabIndex].interfaceName)
                  "
                />
              </span>
            </div>
          </div>
        </div>

        <div class="rightPart">
          <a-spin :spinning="spinning">
            <div class="code">
              <div class="line" v-if="tabName !== 'OCR-公式识别'">
                <span>Responses</span>
                <a-button @click="copyText">{{ btnTxt }}</a-button>
              </div>

              <pre class="dataWrap" v-if="resText" ref="pre" id="dataWrap">
                <textarea id="abc" readonly ref="copy" v-model="textareaString" v-if="!showTextarea"></textarea>
                <div ref="copys" id="copys" v-if="showTextarea">{{ responseData }}</div>
              </pre>

              <div
                v-html="question"
                v-if="question !== ''"
                ref="latexResponse"
              ></div>
              <!-- <pre class="dataWrap" v-else>
                <textarea name="" id="copy2" ref="copy2">无数据</textarea>
              </pre> -->

              <div class="errorTip" v-if="errorTip !== ''">{{ errorTip }}</div>
            </div>
          </a-spin>
        </div>
      </div>
    </div>

    <div class="imgRequire">
      <!-- <div v-html="question" ref="question" /> -->
      图片要求：JPG(JPEG)，图片大小不超过2M，人脸最小150*150像素。
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import { baseImage, jsonSource, fitImgSuffix } from "@/utils/publicJsEvent";
import axios, { AxiosStatic } from "axios";

@Component({
  components: {}
})
export default class ImgIdentify extends Vue {
  @Prop({}) identifyList!: any[];
  get paramId() {
    return this.$route.params.id;
  }
  smallActive: string = "smallActive";

  tabIndex: number = 0;
  imgIndex: number = 0;
  responseArray: any = [];
  btnTxt: string = "一键复制";
  showTextarea: boolean = true;
  responseData: any = {};
  errorTip: string = "";
  textareaString: string = "";

  errorText: boolean = false;
  tipError: string = "";
  resText: boolean = true;

  activeIndex: number = 0;
  largeUrl: string = "";

  tabUrl: string = ""; // 每个tab对应的接口url
  tabName: string = ""; // 每个tab对应的名字
  hostAddress: string = ""; // address
  activeKey: any = ["1"]; // 手风琴默认展开

  question: string = "";
  txtp: string =
    "$\\sqrt\\frac{ x ^ { 2 } + y }{ ( 5 + 6 \\times 7 ) ^ { 2 } }$";
  spinning: boolean = false;
  imgSpinning: boolean = false;

  failed: string = "URL图片获取失败";
  again: string = "请重新选择图片";
  fail: boolean = false;

  @Watch("paramId", { deep: true })
  handleChange() {
    location.reload();
  }
  mounted() {
    console.log("传进来文字识别", this.identifyList);
    this.initPage();

    const MathJax = window.MathJax;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    MathJax.Hub.Config({
      showProcessingMessages: false, //关闭js加载过程信息
      messageStyle: "none", //不显示信息
      extensions: ["tex2jax.js"],
      tex2jax: {
        //行内公式选择符
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"]
        ],
        //段内公式选择符
        displayMath: [
          ["$$", "$$"],
          ["\\[", "\\]"]
        ],
        // 避开某些标签
        skipTags: [
          "script",
          "noscript",
          "style",
          "textarea",
          "pre",
          "code",
          "a"
        ]
      },
      "HTML-CSS": {
        showMathMenu: false
      }
    });
  }
  // 初始化页面
  initPage() {
    this.tabUrl = this.identifyList[0].url;
    this.hostAddress = this.identifyList[0].address;
    this.tabName = this.identifyList[0].interfaceName;
    this.largeUrl = this.identifyList[0].photos[0].url;

    this.txtData(jsonSource(this.largeUrl));
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

  // 切换tab
  changeTab(item: any, index: number) {
    this.imgIndex = 0;
    this.tabIndex = index;
    this.largeUrl = item.photos[0].url;
    this.tabUrl = item.url;
    console.log("tab url", this.tabUrl);
    this.tabName = item.interfaceName;
    this.hostAddress = item.address;
    this.responseArray = [];
    this.question = "";
    const txtUrl = jsonSource(this.largeUrl);
    this.txtData(txtUrl);
  }

  // 切换缩略图
  activeImg(index: number, src: any) {
    this.imgSpinning = true;
    this.spinning = true;
    this.fail = false;
    this.imgIndex = index;
    if (navigator.onLine) {
      const url = this.identifyList[this.tabIndex].photos[this.imgIndex].url;
      this.largeUrl = url;
      const txtUrl = jsonSource(url);
      this.txtData(txtUrl);
    } else {
      this.internetError();
    }
  }
  // 解析新的文本url
  async txtData(url: string) {
    this.responseArray = [];
    this.imgSpinning = true;
    this.spinning = true;
    const res = await axios
      .get(url)
      .then((res: any) => {
        if (res.data !== "") {
          setTimeout(() => {
            this.spinning = false;
            this.imgSpinning = false;
          }, 800);
          this.resData(res);
        } else {
          setTimeout(() => {
            this.internetError();
            this.errorText = true;
            this.resText = false;
            this.fail = true;
            this.tipError = res.data.error;
            this.question = "";
            this.$message.error("无响应数据");
          }, 8000);
          return;
        }
      })
      .catch(error => {
        this.internetError();
        console.log(error);
      });
  }

  resData(res: any) {
    if (res.data.error) {
      [this.errorText, this.resText, this.fail] = [true, false, true];
      this.tipError = res.data.error;
      this.failed = "网络出小差了";
      this.again = "请检查网络后再试";
      this.question = "";
    } else {
      [this.errorText, this.fail] = [false, false];
    }
    if (this.tabName == "OCR-公式识别") {
      if (res.data.data.latex == "null") {
        this.question = "";
        this.failed = "未检测到文字";
        this.again = "请重新选择一张图片";
        [this.errorText, this.fail] = [true, true];
        this.tipError = res.data.data.latex;
        return;
      }
      this.resText = false;
      const question = res.data.data.latex;

      this.question = "$" + `${question}` + "$";
      if (res.data.data.latex) {
        const MathJax = window.MathJax;
        const el = this.$refs.latexResponse as HTMLElement;
        this.$nextTick(() => {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
        });
      }

      this.showTextarea = true;
      setTimeout(() => {
        this.textareaString = this.question;
        this.showTextarea = false;
      });
    } else {
      this.resText = true;
      const newText: any = [];
      if (res.data !== "" && res.data.data.ocr_result) {
        const text = res.data.data.ocr_result;
        // 数组是否为空的判断
        if (Array.isArray(text) && text.length === 0) {
          this.errorRespone(res);
          return;
        }
        text.forEach((item: any) => {
          if (item.text !== "") {
            newText.push(item.text);
          }
        });
        const ar = res.data.data.ocr_result;
        const arr: any = [];
        ar.forEach((item: any, key: number) => {
          arr.push(item.text);
        });
        this.responseData = JSON.parse(
          JSON.stringify(arr, (key: any, value: any) => {
            return value;
          })
        );
        this.responseArray = cloneDeep(newText);
        this.showTextarea = true;
        setTimeout(() => {
          const pre: any = this.$refs.copys as HTMLPreElement;
          this.textareaString = pre.innerHTML;
          this.showTextarea = false;
        });
        this.question = "";
      }
    }
  }

  errorRespone(res: any) {
    this.failed = "未检测到文字";
    this.again = "请重新选择一张图片";
    [this.fail, this.errorText, this.resText] = [true, true, false];
    this.tipError = res.data.data.ocr_result;
  }

  // 检测网络图片
  onCheck(value: any, event: any) {
    this.fail = false;
    this.imgIndex = -1;
    // 监听allowClear后的点击事件（官网没有直接直接监听allowClear,通过类型判断）
    if (value == "" && event.target.type == "button") {
      this.$message.error("请输入图片的地址");
      return;
    } else if (value == "" && event.target.type == "text") {
      if (this.errorText == false) {
        this.fail == false;
      } else {
        this.fail = true;
      }
      return;
    } else if (!value.includes("http") || !value.includes("://")) {
      this.$message.error("您输入的地址错误，请重新输入.", 1);
      return;
    } else {
      // 获取网络图片的名字
      const filename = value.substring(value.lastIndexOf("/") + 1);
      if (filename.lastIndexOf(".") == -1) {
        const internetImg = "internet.jpg";
      } else if (fitImgSuffix(value, true)) {
        const errorMsg = fitImgSuffix(value, true);
        this.$message.error(`${errorMsg}`);
        return;
      }

      const imgparam = {
        dataType: "image/jpeg",
        dataField: "img_file",
        remoteUrl: value
      };

      // 解决跨越图片
      axios({
        method: "get",
        url: `/v1/service-manager/static/deal?url=` + encodeURIComponent(value)
      }).then((res: any) => {
        this.largeUrl = res.config.url;
      });

      this.getAxios(imgparam);
      this.activeIndex = -1;
      this.responseArray = [];
    }
  }

  // 调接口
  getAxios(param: any) {
    this.responseArray = [];
    [this.spinning, this.imgSpinning] = [true, true];
    axios({
      method: "post",
      url: this.tabUrl,
      headers: {
        dmid: "b28847e4-6c1d-49d1-8172-05d3d1c83154",
        service: encodeURIComponent(this.tabName)
      },
      data: param
    })
      .then((res: any) => {
        if (res) {
          [this.spinning, this.imgSpinning] = [false, false];
          this.resData(res);
        }
      })
      .catch(error => {
        let errorCode = error.toString();
        if (errorCode.indexOf("403") !== -1) {
          this.$message.error("您的操作过于频繁，请稍后再试");
        }
        [this.fail, this.errorText, this.resText] = [true, true, false];
        this.question = "";
        this.errorMsg();
      });
  }
  errorMsg() {
    [this.spinning, this.imgSpinning] = [false, false];
    this.failed = "您的操作过于频繁";
    this.again = "请稍后再试";
  }

  // 网络提示
  internetError() {
    [this.spinning, this.imgSpinning] = [false, false];
    this.failed = "网络出小差了";
    this.again = "请检查网络后再试";
  }

  // 上传图片
  uploadImages(event: any, name: string) {
    // @change监控file的变化，如果是同一张图片，则不变化
    const size = event.target.files[0].size;
    const values = event.target.value;
    const fileName = values
      .substring(values.lastIndexOf(".") + 1)
      .toLowerCase();
    // 只能上传jpg,png格式图片
    if (fileName !== "png" && fileName !== "jpg" && fileName !== "jpeg") {
      this.$message.error("上传图片格式不正确，请重新上传");
      event.target.value = "";
      this.fail = false;
      this.activeIndex = -1;
      return false;
    }
    // 图片不能超过2M
    if (size / 1024 > 2024) {
      this.failed = "图片文件太大了";
      this.again = "请重新上传尺寸少于2M的图片";
      [this.fail, this.errorText, this.resText] = [true, false, false];
      this.question = "";
      this.imgIndex = -1;
      event.target.value = "";
    } else {
      this.fail = false;
      this.imgIndex = -1;
      let file = event.target.files[0];
      let param = new FormData(); // 创建form对象

      let reader = new FileReader();
      let self = this;
      reader.onload = (e: any) => {
        let result = e.target.result;
        if (result) {
          this.imgSpinning = false;
        }
        let img = new Image();
        img.src = result;
        param.append("img_file", result);
        const data = {
          img_file: result
        };
        this.getAxios(data);
        this.largeUrl = result;
        // result.length 是base64图片的size;
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../css/sameCss.scss";
@import "../css/OCR.scss";
</style>
