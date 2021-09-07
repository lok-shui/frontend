<template>
  <div>
    <!-- 人体姿态估计 -->
    <!-- 演示视频 -->
    <div class="videoWrap" v-if="showVideo !== 'delete' && showVideo !== ''">
      <div v-if="showVideo == 'delete'">无视频</div>
      <video controls autoplay loop="loop">
        <source :src="showVideo" type="video/mp4" />
      </video>
    </div>

    <!-- 使用体验 -->
    <div class="sceneWrap">
      <div class="title"><span class="line"></span><span>使用体验</span></div>
      <div class="grayBorder">
        <div class="panelTab" v-if="bodyPosture.length > 1">
          <div
            :class="tabIndex == index ? 'activeTab' : ''"
            v-for="(item, index) in bodyPosture"
            :key="index"
            @click="changeTab(item, index)"
          >
            {{ item.interfaceName }}
          </div>
        </div>
        <div class="card-container">
          <a-tabs type="card">
            <a-tab-pane
              v-for="(item, index) in bodyPosture"
              :key="index"
              :tab="item.interfaceName"
              class="imgContain"
            >
              <div class="leftImgBox">
                <div
                  v-for="(c, i) in photo"
                  :key="i"
                  :class="activeIndex == i ? 'activeImg' : 'imgList'"
                  @click="changeImg(i)"
                >
                  <img :src="c.url" alt="" />
                </div>
              </div>

              <div class="rightImgBox">
                <div class="failWrap" v-show="fail">
                  <img
                    src="@/assets/images/v1/upload_failed_icon.png"
                    alt="上传失败"
                  />
                  <div class="fail">{{ failed }}</div>
                  <div class="again">{{ again }}</div>
                </div>

                <a-spin :spinning="largeLoading" tip="加载中..." v-show="!fail">
                  <div class="topImg">
                    <img
                      :src="largeUrl"
                      class="img"
                      crossOrigin="Anonymous"
                      alt="2D图"
                    />
                  </div>
                </a-spin>
                <div class="bodyInput">
                  <a-input-search
                    allowClear
                    placeholder="请将网络图片URL粘贴到输入框"
                    @search="onSearch"
                    ref="netUrl"
                    enterButton="检测"
                  />
                  <span class="orBody">或</span>
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
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import axios, { AxiosStatic } from "axios";
import Player from "xgplayer";
import { baseImage, jsonSource, fitImgSuffix } from "@/utils/publicJsEvent";
import MathService from "@/service/math";
import cache from "@/utils/cache";

const mathServe = MathService.getMathService();

@Component
export default class BodyPosture extends Vue {
  @Prop({}) bodyPosture!: any[];
  @Prop({}) showVideo!: string;
  get paramId() {
    return this.$route.params.id;
  }
  photo: any = [];
  tabName: string = this.bodyPosture[0].interfaceName;
  tabIndex: number = 0;
  tabUrl: string = "";
  activeIndex: number = 0;
  largeUrl: string = "";
  addImg: string = "";
  responseResult: string = "";
  address: string = this.bodyPosture[0].address;
  src: string = "";
  largeLoading: boolean = false; // 大图的loading;

  failed: string = "图片文件太大了";
  again: string = "请重新上传尺寸少于2M的图片";
  fail: boolean = false;
  onLine: boolean = navigator.onLine; //默认有网

  @Watch("paramId", { deep: true })
  handleChange() {
    // 刷新页面
    location.reload();
  }

  mounted() {
    // 过滤掉不是图片的url
    const isImgUrl: any = [];
    this.bodyPosture.forEach((item: any) => {
      this.photo = cloneDeep(item.photos);
      item.photos.forEach((item: any) => {
        if (this.imageSuffix(item.url)) {
          isImgUrl.push(item);
        }
      });
    });
    // this.photo = cloneDeep(isImgUrl);
    this.photo = this.bodyPosture[this.tabIndex].photos;

    this.initPage();
  }

  imageSuffix(url: string) {
    const imgSuffix = [
      ".png",
      ".jpg",
      ".jpeg",
      ".bmp",
      ".gif",
      ".webp",
      ".psd",
      ".svg",
      ".tiff"
    ];
    // 后缀名，如'.jpg'
    const urlSuffix = url.substring(url.lastIndexOf("."));
    const imgUrl = imgSuffix.indexOf(urlSuffix) !== -1;
    return imgUrl;
  }

  // 初始化
  initPage() {
    this.tabUrl = this.bodyPosture[this.tabIndex].url;
    const initUrl = this.bodyPosture[this.tabIndex].photos[0].url;
    const newUrl = jsonSource(initUrl);
    this.txtData(newUrl);
  }

  changeTab(item: any, index: number) {
    this.fail = false;
    this.tabIndex = index;
    this.tabUrl = item.url;
    this.tabName = item.interfaceName;
    this.activeIndex = 0;
    this.largeUrl = item.photos[0].url;
    this.photo = item.photos;
    this.initPage();
  }

  // 切换缩略图
  changeImg(index: number) {
    this.largeLoading = true;
    this.fail = false;
    if (navigator.onLine) {
      this.activeIndex = index;
      const imgurl = this.photo[index].url;
      const newUrl = jsonSource(imgurl);
      this.txtData(newUrl);
    } else {
      this.fail = true;
      this.failed = "网络出小差了";
      this.again = "请检查网络后再试";
      this.largeLoading = false;
    }
  }

  // 在图片url的倒数第四位置拼接'-visual',组成的新的url就是可视化图片
  visualUrl(url: string) {
    const visualData =
      url.split(url.substr(-4, 4))[0] + "-visual" + url.substr(-4, 4);
    setTimeout(() => {
      this.largeLoading = false;
    }, 600);
    return visualData;
  }

  // 解析新的文本url
  async txtData(url: string) {
    const res = await axios.get(url).then((res: any) => {
      let visualImg = res.data.data.image;
      if (visualImg) {
        setTimeout(() => {
          this.largeUrl = visualImg;
          this.largeLoading = false;
        }, 100);
      } else {
        this.$message.error("没有图片");
        this.largeLoading = false;
      }
    });
  }

  // 检测(<a-input-search方法)(上传网络图片)
  onSearch(imgUrl: any, event: any) {
    if (imgUrl == "" && event.target.type == "button") {
      this.$message.error("请输入图片的地址");
      return;
    } else if (imgUrl == "" && event.target.type == "text") {
      return;
    } else if (!imgUrl.includes("http") || !imgUrl.includes("://")) {
      this.$message.error("您输入的地址错误，请重新输入.", 1);
      return;
    }
    // 获取网络图片的名字, 如果有后缀，fitImgSuffix的第二个参数为true
    const filename = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
    if (filename.lastIndexOf(".") == -1) {
      const internetImg = "internet.jpg";
    } else if (fitImgSuffix(imgUrl, true)) {
      const errorMsg = fitImgSuffix(imgUrl, true);
      this.$message.error(`${errorMsg}`);
      return;
    }

    this.largeLoading = true;
    const imgparam = {
      dataType: "image/jpeg",
      dataField: "image_base64",
      remoteUrl: imgUrl
    };
    this.axiosData(imgparam);
    // this.mathPort(
    //   this.bodyPosture[0].url,
    //   imgparam,
    //   encodeURIComponent(this.tabName)
    // );
    this.activeIndex = -1;
  }

  // 上传图片
  uploadImages(event: any) {
    const size = event.target.files[0].size;
    const values = event.target.value;
    const fileName = values
      .substring(values.lastIndexOf(".") + 1)
      .toLowerCase();
    // 只能上传jpg,png格式图片
    const fit = ["png", "jpg", "jpeg"];
    if (fit.indexOf(fileName) == -1) {
      this.$message.error("上传图片格式不正确，请重新上传");
      event.target.value = "";
      this.fail = false;
      return false;
    }
    if (size / 1024 > 2024) {
      this.fail = true;
      event.target.value = "";
      this.activeIndex = -1;
      return;
    } else {
      this.fail = false;
      this.activeIndex = -1;
    }

    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.onload = (e: any) => {
      let result = e.target.result;
      let img = new Image();
      img.src = result;
      this.getAxios(result);
      if (result.length / 1024 > 1024) {
        img.onload = function() {
          self.addImg = baseImage(img);
          self.largeUrl = self.addImg;
        };
      } else {
        self.addImg = result;
        self.largeUrl = self.addImg;
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  // 写死图片头（前缀）
  getAxios(baseUrl: string) {
    this.largeLoading = true;
    this.responseResult = "";
    // 算法接口做的校验：数据头部必须为:"data:image;base64
    const jpg = "data:image/jgp;base64,";
    const png = "data:image/png;base64";
    const jpeg = "data:image/jpeg;base64,";
    let dataImg = baseUrl
      .replace(/\r|\n/g, "")
      .replace(jpg, "")
      .replace(png, "")
      .replace(jpeg, "");
    const imgbase = jpeg + dataImg;

    let param = new FormData();
    param.append("image_base64", imgbase);
    const data = {
      image_base64: imgbase
    };
    this.axiosData(data);
    // this.mathPort(
    //   this.bodyPosture[0].url,
    //   data,
    //   encodeURIComponent(this.tabName)
    // );
  }

  // 接口
  async mathPort(url: string, params: any, service: any) {
    const response = await mathServe.mathPort(url, params, service);
    this.largeLoading = false;
    this.largeUrl = response.image;
  }

  // 调用接口
  axiosData(param: any) {
    this.largeLoading = true;
    this.fail = false;
    axios({
      method: "post",
      url: this.tabUrl,
      headers: {
        dmid: "b28847e4-6c1d-49d1-8172-05d3d1c83154",
        service: encodeURIComponent(this.tabName)
      },
      timeout: 1000 * 60,
      data: param
    })
      .then((res: any) => {
        this.largeLoading = false;
        if (res.data.code == 500 && res.data.error == "system error") {
          this.$message.error("您输入的地址错误，请重新输入");
          return;
        }

        const bbox = res.data.data.bbox;

        if (Array.isArray(bbox) && bbox.length === 0) {
          this.fail = true;
          this.failed = "未检测到人体";
          this.again = "请重新选择含有人体的图片";
          param = "";
          return;
        }
        if (!res.data.data.image) {
          this.fail = true;
          this.failed = "URL图片获取失败";
          this.again = "请重新选择图片";
          return;
        } else if (res.data.data.image) {
          this.fail = false;
          this.largeUrl = res.data.data.image;
        }
        this.responseResult = res.data;
      })
      .catch(error => {
        let errorCode = error.toString();
        if (errorCode.indexOf("403") !== -1) {
          this.$message.error("您的操作过于频繁，请稍后再试");
          return;
        }
        this.fail = true;
        this.failed = "网络出小差了";
        this.again = "请检查网络后再试";
        this.largeLoading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
@import "../css/sameCss.scss";
@import "../css/BodyPosture.scss";
</style>
