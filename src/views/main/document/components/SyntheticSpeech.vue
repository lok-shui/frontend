<template>
  <div class="synthetic">
    <!-- 语音合成组件 -->
    <div class="tab">
      <div
        v-for="(item, index) in newTab"
        :key="item.id"
        :class="tabIndex == index ? 'border' : 'item'"
        @click="changeTab(index, item)"
      >
        {{ item.interfaceName }}
      </div>
    </div>

    <div class="speechWrap">
      <!-- 样例文本 -->
      <div class="samples">
        <div
          :class="activeIndex == i ? 'redBorder' : 'sample'"
          v-for="(item, i) in listTxt"
          :key="i"
          @click="changeItem(i, $event)"
        >
          <div>
            <b class="redColor">样例文本 {{ i + 1 }}</b>
          </div>
          <div class="ellipsis">{{ item }}</div>
        </div>
      </div>

      <div class="txt">
        <!-- textarea输入框 -->
        <div class="textWrap">
          <div class="borderWrap">
            <textarea
              name=""
              cols="30"
              rows="10"
              maxlength="70"
              ref="textarea"
              v-model="textValue"
              @keyup="changeVal"
            ></textarea>

            <div class="txtLength">
              <span>{{ textLength }}/70</span>
            </div>
          </div>
        </div>
        <!-- 试听 -->
        <div class="trySpeech">
          <div class="listen">合成试听</div>

          <!-- 二期时 -->
          <div class="tryListen">
            <div class="voiceItem">
              <div class="leftImg">
                <img :src="womanImgSrc" alt="头像" />
                <span>通用女声</span>
              </div>
              <div class="rightBtn">
                <a-spin :spinning="playLoad" tip="加载中">
                  <a-icon
                    slot="indicator"
                    type="loading"
                    style="font-size: 24px"
                    spin
                  />

                  <div
                    :class="[
                      isPlay == true ? 'focusPlay' : 'play',
                      audioUrl !== '' ? 'focusPlay' : 'play'
                    ]"
                  >
                    <div class="audioWrap">
                      <audio
                        controls="controls"
                        :src="audioUrl"
                        ref="refaudio"
                        :autoplay="audioUrl !== '' && isPlay"
                      ></audio>
                    </div>
                    <div @click="handlePlay" class="handlePlay">
                      <div v-if="isPlay">
                        <img src="@/assets/images/v1/voice_3.png" alt="" />暂停
                      </div>

                      <span v-if="!isPlay">
                        <a-icon type="caret-right" />播放
                      </span>
                    </div>
                  </div>
                </a-spin>
              </div>
            </div>

            <div class="voiceItem" v-if="tabName == '中文合成'">
              <div class="leftImg">
                <img :src="childImgSrc" alt="头像" />
                <span>通用童声</span>
              </div>
              <div class="rightBtn">
                <a-spin :spinning="childLoad" tip="加载中" type="loading">
                  <a-icon
                    slot="indicator"
                    type="loading"
                    style="font-size: 24px"
                    spin
                  />
                  <div
                    :class="[tabIndex == 1 ? 'childCanPlay' : 'childNoPlay']"
                  >
                    <div class="audioWrap">
                      <audio
                        controls="controls"
                        :src="audioChild"
                        ref="childaudio"
                        :autoplay="audioChild !== '' && childPlay"
                      ></audio>
                    </div>
                    <div @click="handlePlaychild" class="handlePlay">
                      <span v-if="childPlay">
                        <img src="@/assets/images/v1/voice_3.png" alt="" />
                        暂停
                      </span>
                      <span v-if="!childPlay">
                        <a-icon type="caret-right" />播放
                      </span>
                    </div>
                  </div>
                </a-spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios, { AxiosStatic } from "axios";
import DocService from "@/service/doc";
import { cloneDeep } from "lodash";

declare var require: any;
const docService = DocService.getDocService();

@Component({
  components: {}
})
export default class SyntheticSpeech extends Vue {
  @Prop({}) speech!: any[];
  get paramId() {
    return this.$route.params.id;
  }
  newTab: any[] = [];
  tabIndex: number = 0;
  tabName: string = ""; // tab的名字
  tabUrl: string = ""; // 调用算法时的url
  tabAddress: string = ""; // tab的address

  activeIndex: number = 0; // 缩略框的索引
  cacheIndex: number = 0; // 缓存的缩略框的索引

  textValue: string = ""; // textarea的输入内容
  textLength: number = this.textValue.length; // textarea的输入内容字数

  womanImgSrc: any = require("@/assets/images/v1/icon_voice_woman.png");
  childImgSrc: any = require("@/assets/images/v1/icon_voice_child.png");

  thumbList: string = ""; // 缩略图里的文本内容
  txtUrl: string = "";
  hasData: string = ""; // 根据数据判断"合成语音"是否可点击

  audioStatic: any[] = []; // 静态的女声
  isPlay: boolean = false; // 女声：控制'播放'和'暂停'
  playLoad: boolean = false; // 女声：loading
  audioUrl: string = ""; // 女声：audio的src
  audioTxtList: any[] = []; //  女声：解析后的base64音频资源

  childStatic: any = {}; // 静态的童声
  childPlay: boolean = false; // 童声：控制'播放'和'暂停'
  childLoad: boolean = false; // 童声：loading
  audioChild: string = ""; // 童声：audio的src
  childAudioList: any[] = []; // 童声：解析后的base64音频资源
  childCanPlay: boolean = false; // 是否可以播放童声
  childResponse: string = ""; // 算法接口返回的童声音频

  listTxt: any = []; // 切割后的样例文本

  @Watch("paramId", { deep: true })
  handleChange() {
    location.reload();
  }

  mounted() {
    // console.log("传进来的语音合成", this.speech);
    const obj: any = {
      url: "",
      name: "",
      childUrl: "",
      childName: ""
    };
    // 缩略图的静态数据: this.speech里photos的url 解析为文本列表和音频列表
    const fitItem = this.speech.filter((item: any) => {
      return item.interfaceName == "童声中文合成";
    });

    this.speech.forEach((item: any, key: number) => {
      if (item.interfaceName == "童声中文合成") {
        const a = {
          child: item
        };
        this.childStatic = {
          url: item.photos[0].url,
          name: item.interfaceName
        };
      } else {
        this.newTab.push(item);
      }
    });

    this.tabUrl = this.newTab[0].url;
    this.tabName = this.newTab[0].interfaceName;
    this.tabAddress = this.newTab[0].address;

    this.newTab.map((item: any, key: number) => {
      this.audioStatic[key] = {
        url: item.photos[0].url,
        name: item.interfaceName
      };

      for (let a in item.photos) {
        // 只匹配以txt结尾的url，去掉以jpg结尾的url
        if (!item.photos[a].url.match(".jpg")) {
          this.txtUrl = item.photos[a].url;
        }
      }
    });

    this.initPage();
  }

  // 初始化页面
  initPage() {
    this.staticUrl(this.tabIndex);
    // 自动播放
    const adultAudio = this.$refs.refaudio as HTMLAudioElement;
    adultAudio.onplay = () => {
      this.isPlay = true;
    };
    adultAudio.onended = () => {
      this.isPlay = false;
    };
  }

  // 静态的url, 同时解析成文本和音频
  staticUrl(index: number) {
    const txtUrl = this.audioStatic[index].url;
    const audioUrl = this.visualUrl(txtUrl);
    const childUrl = this.visualUrl(txtUrl);
    if (this.tabName == "中文合成") {
      const childTxt = this.childStatic.url;
      const childUrl = this.visualUrl(childTxt);
      // 解析童声
      this.audioData(childUrl, "童声");
    }
    this.txtDatanew(txtUrl);
    this.audioData(audioUrl, "女声");
  }

  // 静态的url,变成后缀是分别是'txt'的-visual
  visualUrl(url: string) {
    return url.split(url.substr(-4, 4))[0] + "-visual" + url.substr(-4, 4);
  }

  // 解析txt文件
  async txtDatanew(url: string) {
    const res = await axios.get(url).then((res: any) => {
      this.thumbList = res.data;
      let s = this.thumbList.split("|"); //分割 ↵
      s.shift(); //去空项
      this.listTxt = [];
      for (let a in s) {
        const aa = s[a].replace(/[0-9]/gi, ""); // 去掉数字
        const saa = aa.replace(/\r\n/g, ""); // 去掉↵
        this.listTxt.push(saa);
      }
      this.textValue = this.listTxt[this.activeIndex];
    });
    this.textarea();
  }

  // 解析'样例文本'的音频文件
  async audioData(url: string, name: string) {
    const res = await axios.get(url).then((res: any) => {
      this.thumbList = res.data;
      let s = this.thumbList.split("\n"); //分割
      s.shift(); // 去空项
      const a: any = cloneDeep(res.data.split("\n"));
      a.forEach((item: any, key: number) => {
        const st = `${key}` + '|{"code": 0, "data": {"wav": ';
        const url = item.replace(st, "");
        const st1 = '"';
        const url1 = url.replace(st1, "");
        const last = '"}}';
        const correct = url1.replace(last, "");
        if (name == "童声" && this.tabName == "中文合成") {
          this.childCanPlay = true;
          this.childAudioList.push(correct);
        } else {
          this.audioTxtList.push(correct);
        }
      });
      this.audioUrl = this.audioTxtList[0];
    });
  }

  // 切换tab
  changeTab(index: number, item: any) {
    [this.playLoad, this.childLoad] = [false, false];
    this.tabIndex = index;
    this.activeIndex = 0;
    this.tabName = item.interfaceName;
    this.tabUrl = this.newTab[index].url;
    this.tabAddress = this.newTab[index].address;

    // 清空上一次的数据
    this.audioUrl = "";
    this.audioChild = "";
    this.isPlay = false;
    this.childPlay = false;
    [this.playLoad, this.childLoad] = [false, false];
    this.hasData = "";
    this.audioTxtList = [];
    this.childAudioList = [];

    this.staticUrl(index);
  }

  // 切换缩略框
  changeItem(index: number, event: any) {
    this.activeIndex = index;
    this.cacheIndex = index;
    this.audioUrl = "";
    [this.playLoad, this.isPlay, this.childPlay] = [false, false, false];
    this.hasData = "";
    this.audioChild = "";
    this.textValue = this.listTxt[index];
    this.textarea();
    this.audioUrl = this.audioTxtList[index];
  }

  // textarea 的内容和字数
  textarea() {
    this.textValue = this.listTxt[this.activeIndex];
    this.textLength = this.textValue.length;
  }
  // 特殊字符
  specialChar() {
    let pattern = new RegExp("[`%~@#$^&*()=|{}\\[\\]/~@#￥&*（）——|{}【】]");
    const hasSpecial = pattern.test(this.textValue);
    if (hasSpecial == true) {
      this.$message.warning("您输入的内容有特殊字符");
      return;
    }
  }
  // 监控输入字符数量
  changeVal() {
    if (this.textValue.length > 70) {
      return;
    }
    this.specialChar();
    if (this.listTxt[this.cacheIndex] !== this.textValue) {
      this.textLength = this.textValue.length;
      this.activeIndex = -1;
      this.audioUrl = "";
      this.audioChild = "";
      [this.childCanPlay, this.isPlay, this.childPlay] = [false, false, false];
    } else {
      this.isPlay = false;
      this.audioUrl = this.audioTxtList[this.cacheIndex];
      this.audioChild = this.childAudioList[this.cacheIndex];
      this.activeIndex = this.cacheIndex;
      this.textLength = this.listTxt[this.cacheIndex].length;
    }
  }

  // 通用女声
  handlePlay() {
    // 暂停'童声'
    if (this.tabName == "中文合成") {
      this.childPlay = false;
      const childaudio = this.$refs.childaudio as HTMLAudioElement;
      childaudio.pause();
    }
    if (this.tabName == "英文合成") {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.textValue)) {
        this.$message.warning("请输入英文");
        return;
      }
      let pattern = new RegExp(
        "[`，。、？%~@#$^&*()=|{}\\[\\]/~@#￥&*（）——|{}【】]"
      );
      const hasSpecial = pattern.test(this.textValue);
      if (hasSpecial == true) {
        this.$message.warning("请输入英文");
        return;
      }
    }

    if (this.tabName == "中文合成") {
      this.specialChar();
    }

    if (this.activeIndex == -1) {
      if (this.audioUrl == "") {
        this.playLoad = true;
        axios
          .post(
            this.tabUrl,
            { txt: this.textValue },
            {
              headers: {
                dmid: "b28847e4-6c1d-49d1-8172-05d3d1c83154",
                service: encodeURIComponent(this.tabName)
              },
              timeout: 1000 * 60 // 设为60秒
            }
          )
          .then((res: any) => {
            this.playLoad = false;
            const data = res.data.data;

            if (data.wav == null) {
              this.$message.error("合成失败");
            }
            if (res.data.error) {
              this.$message.error(res.data.error);
            } else if (data == null) {
              this.$message.error("data为：null");
            } else if (data.wav !== "") {
              this.audioUrl = res.data.data.wav;
              this.isPlay = true;
            } else {
              this.isPlay = false;
            }
          })
          .catch((error: any) => {
            this.playLoad = false;
            console.log("error", error);
          });
      }
    }

    const audioref = this.$refs.refaudio as HTMLAudioElement;
    if (!this.isPlay) {
      audioref.play();
      this.isPlay = true;
    } else {
      audioref.pause();
      this.isPlay = false;
    }
    audioref.onended = () => {
      this.isPlay = false;
    };
    audioref.onpause = () => {
      this.isPlay = false;
    };
  }

  // 通用童声
  handlePlaychild() {
    // 暂停'女声'
    if (this.tabName == "中文合成") {
      this.specialChar();
      this.isPlay = false;
      const audioref = this.$refs.refaudio as HTMLAudioElement;
      audioref.pause();
    }

    if (this.activeIndex == -1) {
      const name = this.speech[2].interfaceName;
      if (this.audioChild == "") {
        this.childLoad = true;
        // {"txt": this.textValue}  "txt=" + `${this.textValue}`
        axios
          .post(
            this.tabUrl,
            { txt: this.textValue },
            {
              headers: {
                dmid: "b28847e4-6c1d-49d1-8172-05d3d1c83154",
                service: encodeURIComponent(name)
              },
              timeout: 1000 * 60 // 设为60秒
            }
          )
          .then((res: any) => {
            this.childLoad = false;
            const data = res.data.data;
            if (data.wav == null) {
              this.$message.error("合成失败");
            }
            if (res.data.error) {
              this.$message.error(res.data.error);
            } else if (data == null) {
              this.$message.error("data为：null");
            } else if (data.wav !== "") {
              this.audioChild = res.data.data.wav;
              this.childPlay = true;
            } else {
              this.childPlay = false;
            }
          })
          .catch((error: any) => {
            this.childLoad = false;
          });
      }
    } else {
      // 静态里童声音频
      if (this.tabIndex == 1) {
        this.audioChild = this.childAudioList[this.activeIndex];
      }
      // 算法接口里的童声音频
      if (this.activeIndex == -1 && this.childResponse !== "") {
        this.audioChild = this.childResponse;
      }
    }

    const childaudio = this.$refs.childaudio as HTMLAudioElement;
    if (!this.childPlay) {
      childaudio.play();
      this.childPlay = true;
    } else {
      childaudio.pause();
      this.childPlay = false;
    }
    childaudio.onended = () => {
      this.childPlay = false;
    };
  }
}
</script>
<style lang="scss" scoped>
@import "../css/Speech.scss";
</style>
