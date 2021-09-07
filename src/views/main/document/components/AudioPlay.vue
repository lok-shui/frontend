<template>
  <div>
    <div class="audioBorder">
      <div class="panelTab" v-if="audioData.length > 1">
        <div
          :class="tabIndex == index ? 'activeTab' : ''"
          v-for="(item, index) in audioData"
          :key="index"
          @click="changeTab(item, index)"
        >
          {{ item.interfaceName }}
        </div>
      </div>

      <!-- 语速计算  -->
      <div class="audioWrap">
        <div class="centerBox">
          <!-- 語音片段 -->
          <div class="audioName">
            <div class="try">试用片段</div>
            <div
              :class="activeStyle1"
              @click="loadUrl1($event)"
              v-if="audioData[tabIndex].photos.length >= 1"
            >
              <span>语音片段1</span>
              <span
                @click.stop="play1"
                v-show="p1"
                :class="[activeStyle1 == 'activeList' ? 'pStyle' : 'unclick']"
                ><a-icon type="caret-right" />播放</span
              >
              <span @click.stop="pause1" v-show="pa1" class="pStyle"
                ><img src="@/assets/images/v1/voice_3.png" alt="" />暂停</span
              >
            </div>

            <div
              :class="activeStyle2"
              @click="loadUrl2"
              v-if="audioData[tabIndex].photos.length >= 2"
            >
              <span>语音片段2</span>
              <span
                @click.stop="play2"
                v-show="p2"
                :class="[activeStyle2 == 'activeList' ? 'pStyle' : 'unclick']"
                ><a-icon type="caret-right" />播放</span
              >
              <span @click.stop="pause2" v-show="pa2" class="pStyle"
                ><img src="@/assets/images/v1/voice_3.png" alt="" />暂停</span
              >
            </div>

            <div
              :class="activeStyle3"
              @click="loadUrl3"
              v-if="audioData[tabIndex].photos.length >= 3"
            >
              <span>语音片段3</span>
              <span
                @click.stop="play3"
                v-show="p3"
                :class="[activeStyle3 == 'activeList' ? 'pStyle' : 'unclick']"
                ><a-icon type="caret-right" />播放</span
              >
              <span @click.stop="pause3" v-show="pa3" class="pStyle"
                ><img src="@/assets/images/v1/voice_3.png" alt="" />暂停</span
              >
            </div>
          </div>
          <!-- 波形圖 -->
          <div class="audioWave">
            <div class="audioTitle">
              <span>
                <b>测试结果</b>
                <b class="red">{{ speakingrate }}词/秒</b>
              </span>

              <span class="gray">(正常语速：1.67词/秒)</span>
            </div>

            <div class="wavesurfer">
              <!-- 波形图 -->
              <a-spin :spinning="resultLoading" tip="加载中...">
                <div id="waveform" v-show="!limitImg"></div>
              </a-spin>
              <!-- limit图片  -->
              <div class="limitImgBox" v-show="limitImg">
                <div class="imgdiv">
                  <img src="@/assets/images/v1/file-text.png" alt="" />
                </div>
                <div class="lineTxt">音频文件太大了</div>
                <div class="lineWord">请重新上传尺寸少于200m的音频</div>
              </div>
            </div>
            <!-- 上傳： 只上传mp3和wav格式的音频-->
            <div class="searchBar">
              <span class="local">本地上传:</span>
              <div class="uploadwrap">
                <label for="pop_audio" id="labelWrap">
                  <span class="uploadBtn" ref="uploadBtn"
                    ><a-icon type="upload" />上传音频</span
                  >
                  <input
                    @change="changeBtn($event)"
                    id="pop_audio"
                    type="file"
                    accept="audio/mp3,audio/wav"
                    capture="camcorder"
                    name="fileTrans"
                    ref="inputFile"
                    value=""
                  />
                </label>
                <a-icon type="delete" v-show="delBtn" @click="delFile" />
              </div>

              <button
                :class="changeCss == false ? 'identifyStyle' : 'redBg'"
                ref="identify"
                @click="identifyFile"
                :disabled="changeCss == false"
              >
                识别
              </button>

              <button @click="iPause" v-show="pauseBtn" class="redBg">
                <a-icon type="pause" />暂停
              </button>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
    <div class="limit">
      音频要求：仅限采样率16kHz或8kHz,
      比特率为16bit的wav或mp3格式文件，且文件大小不超过200M。
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import axios, { AxiosStatic } from "axios";
import wavesurfer from "wavesurfer.js";

interface Window {
  webkitURL?: any;
}
declare var WaveSurfer: any;
declare var window: Window;
@Component({
  components: {}
})
export default class AudioPlay extends Vue {
  @Prop({}) audioData!: any[];
  get audioId() {
    return this.$route.params.id;
  }
  wavesurfer: any;
  // 试用片段
  audioList: any = [];
  activeIndex: number = 0;
  tabIndex: number = 0;
  //上传
  upAudio: any; // "未选择任何文件"
  uploadBtn: any; // '上传音频'按钮
  identify: any; // '识别'按钮
  changeCss: boolean = false; // '识别'按钮是否变色
  files: any; // 上传的音频文件
  fileType: string = ""; // 检测音频类型
  fileLength: number = 0; // 上传文件的长度
  fileUrl: string = ""; // 上传文件的路径
  limitImg: boolean = false; // 限制上传音频大小
  // 调语速接口接
  tabUrl: string = this.audioData[0].url;
  tabName: string = this.audioData[0].interfaceName;
  // 播放波形图
  play: boolean = true;
  pause: boolean = false;
  pauseIndex: number = -1;
  pauseBtn: boolean = false; // '暂停'按钮

  fade1: boolean = true;
  fade2: boolean = false;
  p1: boolean = true;
  p2: boolean = true;
  p3: boolean = true;
  pa1: boolean = false;
  pa2: boolean = false;
  pa3: boolean = false;
  activeStyle1: string = "list";
  activeStyle2: string = "list";
  activeStyle3: string = "list";

  // 语速接口返回结果
  speakingrate: number = 0;
  spkdur: number = 0;
  time_duration: number = 0;
  responseCount: number = 0; // 说话字数
  delBtn: boolean = false;
  resultLoading: boolean = false; // 语速的loading
  audioUrlBase64: string = ""; // 数据里的音频资源url转为base64
  audioFileBase64: string = ""; // 上传的音频转为base64

  // 监听ID的变化
  @Watch("audioId", { deep: true })
  handleRouteChange() {
    location.reload();
  }

  mounted() {
    this.upAudio = this.$refs.inputFile as HTMLElement;
    this.uploadBtn = this.$refs.uploadBtn as HTMLHtmlElement;
    this.identify = this.$refs.identify as HTMLElement;
    const staticUrl = this.audioData[this.tabIndex].photos[0].url;
    this.txtDatass(staticUrl);
    // 波形图
    this.audioList = cloneDeep(this.audioData[this.tabIndex].photos);
    // 语音片段控制在3个之内
    if (this.audioList.length > 3) {
      this.audioList.shift();
    }

    this.wavesurfer = wavesurfer.create({
      container: "#waveform",
      // waveColor: "violet",
      waveColor: "#ECEEF2",
      progressColor: "red"
    });

    this.activeStyle1 = "activeList";
    this.activeStyle2 = "list";
    this.activeStyle3 = "list";
    const url = this.audioData[this.tabIndex].photos[0].url;
    this.wavesurfer.load(url);
    this.switchTo(url);

    // 结束播放
    this.wavesurfer.on("finish", (e: any) => {
      this.init();
      // 停止播放并回到起始点
      this.wavesurfer.stop();
    });
    this.wavesurfer.on("seek", (e: any) => {
      this.pause1();
      this.pause2();
      this.pause3();
    });
  }

  // 解析新的文本url，返回语速的测试结果
  async txtDatass(staticUrl: any) {
    const suffixName = staticUrl.substring(staticUrl.lastIndexOf(".") + 1); // 获取后缀名
    const newTxtUrl = staticUrl.replace(suffixName, "txt");
    const res = await axios.get(newTxtUrl).then((res: any) => {
      if (res.data.data !== undefined) {
        this.speakingrate = res.data.data.speakingrate.toFixed(2);
      } else {
        this.speakingrate = 0;
      }
    });
  }

  init() {
    [this.p1, this.p2, this.p3] = [true, true, true];
    [this.pa1, this.pa2, this.pa3] = [false, false, false];
    this.activeIndex = 0;
    this.fileLength = 0;
    this.files = [];
    this.identify.style.display = "block"; // '识别'
    this.upAudio.style.display = "none";
    this.uploadBtn.style.display = "block";
    [this.delBtn, this.limitImg] = [false, false];
  }

  changeTab(item: any, index: number) {
    this.tabIndex = index;
    this.tabUrl = item.url;
    this.tabName = item.interfaceName;
    this.init();
    this.loadUrl1();
  }

  loadUrl1() {
    this.activeStyle1 = "activeList";
    this.activeStyle2 = "list";
    this.activeStyle3 = "list";
    this.activeIndex = 0;
    const url = this.audioData[this.tabIndex].photos[0].url;
    this.wavesurfer.load(url);
    this.wavesurfer.on("finish", (e: any) => {
      this.init();
      // 停止播放并回到起始点
      this.wavesurfer.stop();
      this.upAudio.style.display = "none";
    });
    if (this.audioData[this.tabIndex].photos.length >= 1) {
      this.switchTo(url);
    }
    const staticUrl = this.audioData[this.tabIndex].photos[0].url;
    this.txtDatass(staticUrl);
    this.init();
  }

  loadUrl2() {
    this.activeStyle2 = "activeList";
    this.activeStyle1 = "list";
    this.activeStyle3 = "list";
    this.activeIndex = 1;
    const url = this.audioData[this.tabIndex].photos[1].url;
    if (this.audioData[this.tabIndex].photos.length >= 1) {
      this.switchTo(url);
    }

    this.wavesurfer.load(url);
    const staticUrl = this.audioData[this.tabIndex].photos[1].url;
    this.txtDatass(staticUrl);
    this.init();
  }

  loadUrl3() {
    this.activeStyle3 = "activeList";
    this.activeStyle1 = "list";
    this.activeStyle2 = "list";
    this.activeIndex = 2;
    const url = this.audioData[this.tabIndex].photos[2].url;
    this.wavesurfer.load(url);
    if (this.audioData[this.tabIndex].photos.length >= 1) {
      this.switchTo(url);
    }
    const staticUrl = this.audioData[this.tabIndex].photos[2].url;
    const suffixName = staticUrl.substring(staticUrl.lastIndexOf(".")); // 获取后缀名
    const newTxtUrl = staticUrl.replace(suffixName, ".txt");

    this.txtDataThird(newTxtUrl);
    this.init();
  }

  async txtDataThird(newTxtUrl: any) {
    const res = await axios.get(newTxtUrl).then((res: any) => {
      if (res.data.data !== undefined) {
        this.speakingrate = res.data.data.speakingrate.toFixed(2);
      } else {
        this.speakingrate = 0;
      }
    });
  }

  play1() {
    [this.p1, this.pa1] = [false, true];
    this.wavesurfer.play();
  }
  pause1() {
    [this.p1, this.pa1] = [true, false];
    this.wavesurfer.pause();
  }
  play2() {
    [this.p2, this.pa2] = [false, true];
    this.wavesurfer.play();
  }
  pause2() {
    [this.p2, this.pa2] = [true, false];
    this.wavesurfer.pause();
  }
  play3() {
    [this.p3, this.pa3] = [false, true];
    this.wavesurfer.play();
  }
  pause3() {
    [this.p3, this.pa3] = [true, false];
    this.wavesurfer.pause();
  }

  // 切换'播放'
  switchTo(audioUrl: any) {
    // 清掉旧值
    this.upAudio.value = "";
    [this.changeCss, this.pauseBtn] = [false, false];
    const mp3Request = new Request(audioUrl);
    fetch(mp3Request)
      .then(response => {
        return response.blob();
      })
      .then(myBlob => {
        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
          // 前缀：application/x-msdownload 转为audio/mp3或audio/wav
          const base1 = "data:text/html;base64,";
          const base2 = "data:application/x-msdownload;base64,";
          if (audioUrl.match("mp3")) {
            let dataImg = e.target.result
              .replace(/\r|\n/g, "")
              .replace(base1, "")
              .replace(base2, "");
            const imgbase = "data:audio/mp3;base64," + dataImg;
            this.audioUrlBase64 = imgbase;
          } else if (audioUrl.match("wav")) {
            let dataImg = e.target.result
              .replace(/\r|\n/g, "")
              .replace(base1, "")
              .replace(base2, "");
            const imgbase = "data:audio/wav;base64," + dataImg;
            this.audioUrlBase64 = imgbase;
          }
        };
        fileReader.readAsDataURL(myBlob);
      });
  }

  getAxios(param: any) {
    this.resultLoading = true;
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
        this.resultLoading = false;
        if (res.data.code !== 0 && res.data.error) {
          this.$message.error(res.data.error);
        } else if (res.data.data) {
          const resData = res.data.data;
          this.responseCount = resData.voicedcount;
          const sp = res.data.data.speakingrate;
          this.speakingrate = sp.toFixed(2);
        }
      })
      .catch((error: any) => {
        this.$message.error(error.response.data.message);
        this.resultLoading = false;
      });
  }

  // 上传-识别
  identifyFile() {
    this.identify.style.display = "none";
    [this.pauseBtn, this.changeCss] = [true, false];
    this.wavesurfer.play();
  }

  // 上传-暂停
  iPause() {
    this.wavesurfer.pause();
    [this.pauseBtn, this.changeCss] = [false, true];
    this.identify.style.display = "block";
  }

  // 删除上传文件
  delFile() {
    [this.changeCss, this.delBtn] = [false, false];
    this.fileLength = 0;
    this.files = [];
    this.upAudioControl();
    this.limitImg = false;
    this.activeIndex = 0;
    this.loadUrl1();
  }

  // 上传音频 audio/mpeg
  changeBtn(event: any) {
    this.activeStyle1 = "list";
    this.activeStyle2 = "list";
    this.activeStyle3 = "list";
    this.fileType = "";
    this.pause1();
    this.pause2();
    this.pause3();
    if (event.target.files.length > 1) {
      this.$message.error("只能上传单个文件");
      return;
    }
    // 限制格式
    this.fileType = event.target.files[0].type;
    const type: any = ["audio/mpeg", "audio/wav", "audio/mp3"];

    if (type.indexOf(this.fileType) == -1) {
      this.$message.error("请上传mp3或wav格式的音频");
      return;
    }
    this.files = event.target.files[0];
    this.fileLength = event.target.files.length;
    const size = Math.round(this.files.size / 1024 / 1024);
    if (size > 200) {
      event.target.value = "";
      this.limitImg = true;
    } else {
      const reader = new FileReader();
      const self = this;
      this.changeCss = true;
      reader.onload = (e: any) => {
        if (this.fileType == "audio/mpeg") {
          const result = e.target.result;
          let dataImg = result.replace("data:audio/mpeg;base64,", "");
          const imgbase = "data:audio/mp3;base64," + dataImg;
          const param = new FormData();
          param.append("wave_file", imgbase);
          const data = {
            wave_file: imgbase
          };
          this.getAxios(data);
        } else if (this.fileType == "audio/wav") {
          const result = e.target.result;
          const param = new FormData();
          param.append("wave_file", result);
          const data = {
            wave_file: result
          };
          this.getAxios(data);
        } else if (this.fileType == "audio/mp3") {
          const result = e.target.result;
          let dataImg = result.replace("data:audio/mp3;base64,", "");
          const imgbase = "data:audio/mp3;base64," + dataImg;
          const param = new FormData();
          param.append("wave_file", imgbase);
          const data = {
            wave_file: result
          };
          this.getAxios(data);
        }
      };
      reader.readAsDataURL(this.files);
      [this.limitImg, this.delBtn] = [false, true];
      this.upAudioControl();
      this.fileUrl = URL.createObjectURL(event.target.files[0]);
      this.wavesurfer.load(this.fileUrl);

      this.wavesurfer.on("seek", (e: any) => {
        this.iPause();
      });

      // 结束播放
      this.wavesurfer.on("finish", (e: any) => {
        this.wavesurfer.stop();
        [this.pauseBtn, this.changeCss, this.delBtn] = [false, true, true];
        this.upAudioControl();
      });
      this.activeIndex = -1;
    }
  }

  upAudioControl() {
    this.upAudio.style.display = "block";
    this.uploadBtn.style.display = "none";
  }
}
</script>
<style lang="scss" scoped>
@import "../css/Audio.scss";
</style>
