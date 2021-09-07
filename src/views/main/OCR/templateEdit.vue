<template>
  <div class="bgColor">
    <div class="topBar flexBet">
      <div class="topLeft flex">
        <div @click="toListPage">模板管理</div>
        <span class="oblique">/</span>
        <div>编辑模板</div>
      </div>

      <div class="topCenter flex">
        <div class="centerItem flexCom" @click="scaleEvent(1)">
          <div class="img"><img :src="enlarge" alt="" /></div>
          <div>放大</div>
        </div>
        <div class="centerItem flexCom" @click="scaleEvent(-1)">
          <div class="img"><img :src="shrink" alt="" /></div>
          <div>缩小</div>
        </div>
        <!-- <div class="centerItem flexCom">
          <div class="img"><img :src="adapt" alt="" /></div>
          <div>适应画面</div>
        </div> -->
        <div class="centerItem flexCom" @click="rebackDef">
          <div class="img"><img :src="propor" alt="" /></div>
          <div>原始大小</div>
        </div>
      </div>

      <div class="topRight flexCen">
        <a-button class="saveBtn" @click="saveEvent">保存</a-button>
        <a-button class="try" @click="trialTem">试一试</a-button>
        <a-button @click="releaseEvent">发布</a-button>
        <a-dropdown v-model="uservisible">
          <a-button class="moreBtn flexCen"><a-icon type="ellipsis"/></a-button>
          <a-menu slot="overlay" class="changeTemEdit">
            <a-menu-item class="downMenuItem flexComBet">
              <div class="item" @click="changeImage">更改模板图片</div>
              <div class="item" @click="changeName">修改模板名称</div>
              <div class="item" @click="toListPage">返回</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <!-- 识别区 -->
    <div class="rightPanel">
      <div class="rightContent">
        <a-tabs :default-active-key="tabIndex" @change="changeTab">
          <!-- 第一步 -->
          <a-tab-pane :key="1">
            <!-- 标题 -->
            <span slot="tab" class="stepBg">
              <b>第1步</b>
              <b class="marginLeft">框选参照字段</b>
              <span
                class="icons"
                @mouseenter="showPop1(true)"
                @mouseleave="showPop1(false)"
                ><a-icon type="info-circle"
              /></span>
            </span>
            <div class="popTip" v-if="showPopBox1">
              <div class="arrow"></div>
              <div class="popWord">
                <pre>{{ refRule }}</pre>
              </div>
            </div>
            <!--空白 -->
            <div class="defaultContent" v-if="referenceArea.length == 0">
              <p>{{ refLine1 }}</p>
              <p>{{ refLine2 }}</p>
              <div class="defImg flexCen"><img :src="emptyR" /></div>
            </div>
            <!--识别区 -->
            <div v-if="referenceArea.length !== 0">
              <div class="tipWord" v-if="referenceArea.length < 4">
                {{ refTip }}
              </div>
              <div
                class="identifyArea"
                v-for="(val, index) in referenceArea"
                :key="index"
                @mouseenter="lightUpRef(val, index)"
                @mouseleave="cancelLightRef(index)"
              >
                <div class="flexBet">
                  <span>参照字段{{ index + 1 }}</span>
                  <img :src="delIcon" @click="delReferenceItem(index)" />
                </div>
                <div class="firstStep">
                  <a-input
                    placeholder="识别内容为空"
                    v-model="referenceTextList[index]"
                    @change="inputChange(referenceTextList[index], index)"
                  />
                  <div v-if="referenceTextList[index] == ''" class="ruleTip">
                    框选区内未识别到内容，请修改或重新选区
                  </div>
                  <!-- 是否跨行要框选坐标判断 -->
                  <!-- <div v-if="inputVal==''" class="ruleTip">请勿跨行选取参照字段（否则会导致模板匹配失败）</div> -->
                </div>
              </div>
            </div>
          </a-tab-pane>

          <!-- 第二步 -->
          <a-tab-pane :key="2">
            <!-- 标题 -->
            <span slot="tab" class="stepBg">
              <b>第2步</b>
              <b class="marginLeft">框选识别区</b>
              <span
                class="icons"
                @mouseenter="showPop2(true)"
                @mouseleave="showPop2(false)"
              >
                <a-icon type="info-circle" />
              </span>
            </span>
            <div class="popStep2" v-if="showPopBox2">
              <div class="arrow"></div>
              <div class="popWord">
                <pre>{{ idenRule }}</pre>
              </div>
            </div>

            <!--空白 -->
            <div class="defaultContent" v-if="identifyArea.length == 0">
              <div class="tipWord">至少设置1个识别区</div>
              <p>{{ idenLine1 }}</p>
              <p>{{ idenLine2 }}</p>
              <div class="defImg flexCen"><img :src="emptyI" alt="" /></div>
            </div>

            <!--识别区 -->
            <div v-if="identifyArea.length !== 0">
              <div
                class="identifyArea"
                v-for="(item, index) in identifyArea"
                :key="index"
                @mouseenter="lightUpIden(item, index)"
                @mouseleave="cancelLightIden(index)"
              >
                <div class="flexBet">
                  <span>识别区 {{ index + 1 }}</span>
                  <img :src="delIcon" @click="delIdentifyItem(index)" />
                </div>
                <div class="secondStep flexBet">
                  <div class="span">字段名称：</div>
                  <a-input
                    placeholder="最多输入20个字符（中/英）"
                    v-model="fieldName[index]"
                    @change="fieldInput(index)"
                    :maxLength="20"
                  />
                </div>

                <div class="secondStep flexBet">
                  <div class="span">字段类型：</div>
                  <a-input
                    class="optInput"
                    v-model="fieldTypeList[index]"
                    @focus="showOption(true, index)"
                    @click="clickOption($event, true, index)"
                  >
                    <a-tooltip slot="suffix" title="Extra information">
                      <a-icon type="right" v-if="fieldIndex !== index" />
                      <a-icon type="down" v-if="fieldIndex == index" />
                    </a-tooltip>
                  </a-input>
                </div>
                <div class="secondStep flexBet">
                  <div class="span">识别结果：</div>
                  <div class="result">{{ identifyTextList[index] }}</div>
                </div>
                <div class="redTip" v-if="identifyTextList[index] == ''">
                  识别字段名称不能为空
                </div>
                <!-- 字段类型的下拉选项 start-->
                <div
                  :class="optionClass"
                  v-if="fieldIndex == index"
                  @mouseleave="showOption(false, index)"
                >
                  <div class="opItemBox">
                    <div
                      class="opItem"
                      v-for="(sItem, i) in fieldOption"
                      :key="i"
                    >
                      <div
                        v-if="sItem == '我的字段类型'"
                        class="flexBet"
                        @click="showSecondMenu(index, sItem)"
                      >
                        <div>{{ sItem }}</div>
                        <div><a-icon type="right" /></div>
                      </div>
                      <div v-else @click="fieldChange(index, sItem)">
                        {{ sItem }}
                      </div>
                    </div>
                  </div>
                  <div class="myItemBox" v-if="secondMenu">
                    <div
                      class="myItem"
                      v-for="(myItem, myIndex) in myType"
                      :key="myIndex"
                    >
                      <div class="flexBet">
                        <div @click="showThirdMenu(index, myIndex, myItem)">
                          {{ myIndex }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 字段类型的选项 end-->
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <div class="leftArea" ref="leftArea">
      <div class="barBox">
        <div class="controlBar flex">
          <div :class="[moveClass, 'btnBg']" @click="moveCanvas">
            <img :src="moveNormal" v-if="moveNormalBtn" />
            <img :src="move" v-if="!moveNormalBtn" />
            移动
          </div>
          <div
            :class="[referenceClass, 'btnBg']"
            @click="drawRectArea(true, false)"
            v-show="tabIndex == 1"
          >
            <img :src="reference" v-if="!refNormalBtn" />
            <img :src="refNormalIcon" v-if="refNormalBtn" />
            框选参照字段
          </div>
          <div
            :class="[identifyClass, , 'btnBg']"
            @click="drawRectArea(false, true)"
            v-show="tabIndex == 2"
          >
            <img :src="frame" v-if="!idenNormalBtn" />
            <img :src="frameNormal" v-if="idenNormalBtn" />
            框选识别区
          </div>
          <!-- 下一个版本上 -->
          <!-- <div class="addForm" @mouseenter="showInputNum(true)">
            <img :src="tableNormal" alt="" />识别表格
          </div> -->

          <!-- 没框选前展示 -->
          <div
            class="grayBox flex"
            v-if="identifyArea.length == 0 && referenceArea.length == 0"
          >
            <div class="little flexCom" @click="rotateEvent">
              <img :src="sync" /><span>旋转</span>
            </div>
            <div class="little flexCom" @click="clipEvent">
              <img :src="scissor" /><span>裁剪</span>
            </div>
          </div>
        </div>
        <!-- 下一个版本上 -->
        <!-- <div class="inputNumber flexComCen" v-show="fadeNumber" @click="tableClick"  @mouseleave="showInputNum(false)">
          <div>插入<a-input v-model="numberVal" />列表格</div>
          <div class="confirm" @click="confirmNumber">插入</div>
        </div> -->
      </div>

      <div class="canvas-box" ref="canvasWrap">
        <canvas id="itemcanvans" ref="itemcanvans"></canvas>
      </div>
    </div>

    <!-- "旋转"弹窗 -->
    <a-modal
      title="旋转照片"
      v-model="rotateVisible"
      :maskClosable="false"
      @ok="rotateConfirm"
    >
      <canvas
        id="rotateCanvas"
        :width="rotatew"
        :height="rotateh"
        ref="rotateCanvas"
        style="border: 1px solid rgba(0,0,0,0.15)"
      ></canvas>
      <div class="progressBtn flex">旋转角度：</div>
      <a-slider
        :marks="sliderParam"
        :default-value="0"
        :max="360"
        v-model="sliderVal"
        @change="sliderChange"
      />
    </a-modal>

    <!-- "裁剪"弹窗 -->
    <a-modal
      title="裁剪照片"
      v-model="clipVisible"
      :maskClosable="false"
      class="clipModal"
      @ok="confirmClip"
      @cancel="cancelClip"
    >
      <div class="clipContext ">
        <canvas
          id="clipCanvas"
          :width="clipwidth"
          :height="clipheight"
        ></canvas>
        <!-- <canvas id="markCanvas"  :width="clipwidth" :height="clipheight"></canvas> -->
      </div>
      <!-- <img :src="clipUrl" alt="" style="border: 1px solid red;"> -->
    </a-modal>

    <!-- "试一试"弹窗 -->
    <a-modal
      title="试一试"
      v-model="trialVisible"
      :maskClosable="false"
      class="trialModal"
      @cancel="tryAgain"
    >
      <div class="flexCen">
        <div class="leftUpload">
          <a-upload
            v-if="trialPreviewImage == ''"
            list-type="picture-card"
            :file-list="imgList1"
            :customRequest="uploadTemImage"
          >
            <div class="flexCom">
              <div><img :src="uploadI" alt="" /></div>
              <div class="middle">点击或将文件拖拽到这里上传</div>
              <div>图片大小不超过4m，最长边不超过2048px</div>
            </div>
          </a-upload>

          <div class="trialImgBox flexCen" v-if="trialPreviewImage !== ''">
            <img :src="trialPreviewImage" alt="" />
            <div class="toChoose flexCen">
              <a-upload :file-list="imgList1" :customRequest="uploadTemImage">
                <div style="color:#fff;">重新选择</div>
              </a-upload>
            </div>
          </div>
        </div>
        <div class="rightResult">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1">
              <span slot="tab"><b>识别结果</b></span>
              <div class="nullTxt flexComCen" v-if="trialData.length == 0">
                <div class="nullImg">
                  <img :src="emptyU" alt="" />
                </div>
                <div>识别结果区</div>
              </div>
              <a-spin :spinning="trialLoading" tip="识别中...">
                <div class="jsonBox" v-if="trialData.length !== 0">
                  <div class="title">
                    <span class="titleleft">字段名称</span>
                    <span>内容</span>
                  </div>
                  <div
                    v-for="(item, index) in trialData"
                    :key="index"
                    class="line flex"
                  >
                    <div class="name">{{ item.name }}</div>
                    <div class="cont">{{ item.content }}</div>
                  </div>
                </div>
              </a-spin>
            </a-tab-pane>

            <a-tab-pane key="3">
              <span slot="tab"><b>Json</b></span>
              <div class="jsonBox">
                <pre>{{ trialResponse }}</pre>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-modal>

    <!-- "暂存成功"弹窗  -->
    <a-modal
      v-model="saveVisible"
      :maskClosable="false"
      okText="继续编辑"
      cancelText="返回列表"
      class="saveModal"
      @ok="saveSuccess"
      @cancel="backTemList"
    >
      <div class="flexCom">
        <div class="greenIcon"><img :src="maxImg" /></div>
        <div class="words">暂存成功</div>
      </div>
    </a-modal>

    <!-- "发布成功"弹窗  -->
    <a-modal
      v-model="releaseVisible"
      :maskClosable="false"
      class="releaseModal"
    >
      <div class="flexCom">
        <div class="greenIcon"><img :src="release" alt="" /></div>
        <div class="boldWord">恭喜您，模板已发布成功</div>
        <div>模板ID：{{ templateId }}</div>
        <div class="warmPrompt">
          <div>温馨提示：</div>
          <div class="line1">{{ release0 }}</div>
          <div>{{ release1 }}</div>
          <div>{{ release2 }}</div>
          <div>{{ release3 }}</div>
        </div>
      </div>
      <div class="footerBtn flexCen">
        <a-button class="btn1" @click="releaseSuccess">继续编辑</a-button>
        <a-button @click="backTemList">返回列表</a-button>
      </div>
    </a-modal>
    <!-- "更改模板图片"弹窗  -->
    <a-modal
      title="更改模板图片"
      v-model="changeImgVisible"
      :maskClosable="false"
      class="createModal"
      @ok="confirmBtn"
      @cancel="toChooseBtn"
    >
      <a-form-model ref="ruleForm">
        <a-form-model-item label="模板照片：">
          <a-upload
            v-if="modalPreviewImage == ''"
            list-type="picture-card"
            :file-list="imgList2"
            :customRequest="uploadCreateImage"
          >
            <div class="flexCom">
              <div><img :src="uploadI" alt="" /></div>
              <div class="middle">点击或将文件拖拽到这里上传</div>
              <div>图片大小不超过4m，最长边不超过2048px</div>
            </div>
          </a-upload>

          <div class="createImgBox flexCen" v-if="modalPreviewImage !== ''">
            <img :src="modalPreviewImage" alt="" />
            <div class="toChoose flexCen">
              <a-upload
                :file-list="imgList2"
                :customRequest="uploadCreateImage"
              >
                <div style="color:#fff;">重新选择</div>
              </a-upload>
            </div>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- "修改模板名字"弹窗  -->
    <a-modal
      title="修改模板名字"
      v-model="nameVisible"
      :maskClosable="false"
      class="nameModal"
      @ok="nameConfirm"
    >
      <div class="flex">
        <div class="names">模板名字：</div>
        <a-input ref="userNameInput" v-model="newName" allow-clear> </a-input>
      </div>
      <div v-if="newName == ''" class="nameTip">请输入名字</div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import OCRService from "@/service/ocrTem";
import cache from "@/utils/cache";
import fileConversion from "@/utils/fileConversion";

import canvasTS from "./ocrTS/canvas";
import ocrResult from "./ocrTS/ocrResult";
import { fitImgSuffix } from "@/utils/publicJsEvent";

const ocrService = OCRService.getOCRService();

@Component({
  components: {}
})
export default class templateList extends Vue {
  templateUrl: string = "";
  templateName: string = "";
  templateId: any = "";
  tabIndex: number = 1;
  uservisible: boolean = false; // 下拉菜单
  enlarge: any = require("@/assets/images/v3/enlarge@2x.png");
  shrink: any = require("@/assets/images/v3/shrink@2x.png");
  adapt: any = require("@/assets/images/v3/adapt@2x.png");
  propor: any = require("@/assets/images/v3/proportional@2x.png");
  emptyR: any = require("@/assets/images/v3/empty_guidelines_2@2x.png");
  emptyI: any = require("@/assets/images/v3/empty_guidelines_3@2x.png");
  delIcon: any = require("@/assets/images/v3/delete.png");
  moveNormal: any = require("@/assets/images/v3/moveNormal.png");
  move: any = require("@/assets/images/v3/move.png");
  reference: any = require("@/assets/images/v3/reference.png");
  refNormalIcon: any = require("@/assets/images/v3/referenceNormal.png");
  frame: any = require("@/assets/images/v3/frame.png");
  frameNormal: any = require("@/assets/images/v3/frameNormal.png");
  tableNormal: any = require("@/assets/images/v3/tableNormal.png");
  sync: any = require("@/assets/images/v3/sync@2x.png");
  scissor: any = require("@/assets/images/v3/scissor@2x.png");

  uploadI: any = require("@/assets/images/v3/icon_unload.svg");
  emptyU: any = require("@/assets/images/v3/empty_icon@2x.png");
  maxImg: any = require("@/assets/images/v3/maxImg.png");
  release: any = require("@/assets/images/v3/release.png");

  refLine1: string = "参照字段是什么？";
  refLine2: string =
    "参照字段为图片中文字及位置固定的文字内容，用于相同版式识别图片的自动矫正和模板匹配";
  refTip: string = "请至少设置4个参照字段，最多20个";
  refRule: string =
    "框选参照字段设置规则：" +
    `\n` +
    "1.锚点必须是不变的文字，且中间没有大片空白" +
    `\n` +
    "2.锚点尽可能靠近识别内容，如位于同一行或者相邻行" +
    `\n` +
    "3.锚点越多越好，建议在4个以上，20个以内" +
    `\n` +
    "4.自动识别的锚点内容如有错误，请手动修改正确";
  idenLine1: string = "识别区是什么？";
  idenLine2: string =
    "识别区是图片中要识别的字段，用于构建Key-Value对应关系，输出结构化识别结果。";
  idenRule: string =
    "框选识别区设置规则：" +
    `\n` +
    "1.识别结果以KV形式展示，请配置有业务意义的字段名" +
    `\n` +
    "2.字段名相同的内容会按条目顺序合并为一条识别结果" +
    `\n` +
    "3.若表格的表头内容不变，建议将每列表头分别圈为锚点" +
    `\n` +
    "4.表格识别对表行数不限定，同时不支持只圈选部分行";

  release0: string = "接下来您可以使用模板ID，将该模板调用到自己的APP中";
  release1: string = "1. 如果您还没有在控制台中创建APP，请先创建APP。";
  release2: string =
    "2. 在调用API接口时，在入参中使用该ID，便可将该模板应用到您的APP中。";
  release3: string = "3. 现在您可以参照技术文档通过SDK/API的方式调用此模板。";
  // 更改图片
  changeImgVisible: boolean = false;

  // 更改名字
  nameVisible: boolean = false;
  newName: string = "";
  // 字段
  fieldName: Array<string> = [];
  fieldTypeList: Array<string> = ["常规"];
  defaultField: string = "常规";
  fieldOption: Array<string> = [];
  myType: Object = {}; // 我的字段类型
  secondMenu: boolean = false;
  fieldIndex: number = -1; // 字段类型的索引
  optionClass: string = "optionStyle";
  optionArrow: boolean = true;
  // 保存
  saveVisible: boolean = false;
  // 发布
  releaseVisible: boolean = false;
  // 消息弹窗1
  showPopBox1: boolean = false;
  // 消息弹窗2
  showPopBox2: boolean = false;
  // 识别表格
  fadeNumber: boolean = false;
  numberVal: any = null;
  inputTip: boolean = false;
  inputVal: string = "";
  fieldType: string = "";
  // canvas
  canvasWrap: any;
  canvasBgw: number = 0;
  canvasBgh: number = 0;
  IMAGE: any;
  IL: number = 0;
  IT: number = 0;
  IW: number = 0;
  IH: number = 0;
  imgCanvas: any;
  imgContext: any;
  imgLeft: number = 0;
  imgTop: number = 0;
  // 图片的原始大小
  imgOriginalW: number = 0;
  imgOriginalH: number = 0;
  // 图片放大/缩小时的scale值
  changeScale: number = 1;
  // 裁剪
  clipVisible: boolean = false;
  clipwidth: number = 510;
  clipheight: number = 391;
  CIW: number = 0;
  CIH: number = 0;
  clipDrag: boolean = false;
  cutImgSrc: string = "";
  clipUrl: string = "";
  clipDrawImage: any;
  clipArea: any = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };
  isCliped: boolean = false;
  clipWP: number = 1;
  clipHP: number = 1;
  // 旋转
  rotateVisible: boolean = false;
  rotatew: number = 512;
  rotateh: number = 320;
  rotateUrl: string = "";
  sliderParam: Object = {
    0: "0°",
    45: "",
    90: "90°",
    135: "",
    180: "180°",
    225: "",
    270: "270°",
    315: "",
    360: "360°"
  };
  sliderVal: number = 0;
  RIW: number = 0;
  RIH: number = 0;

  // 试一试
  trialVisible: boolean = false;
  trialPreviewImage: string = "";
  trialData: Array<Object> = [];
  trialResponse: Object = {};
  trialLoading: boolean = false;
  // 上传图片
  imgList1: Array<Object> = [];
  imgList2: Array<Object> = [];

  modalPreviewImage: string = "";
  uploadParams: any;
  responseId: any;
  // 移动
  isCanMove: boolean = false;
  strokeRef: boolean = false;
  strokeIden: boolean = false;
  moveClass: string = "noMove";
  moveNormalBtn: boolean = true;
  // 框选参照字段
  referenceArea: Array<Object> = []; //坐标
  referenceTextList: Array<string> = []; // 识别结果
  referenceObject: any = []; // 坐标 识别结果 noIdentify
  refNormalBtn: boolean = true;
  referenceClass: string = "noRectChoose";
  objReference: Object = {};
  referenceParams: Object = {};
  initRefPoint: Array<Object> = []; // 恢复原始大小step1
  // 移动参照区的矩形框
  isCanMoveRef: boolean = false;
  moveRefCanvas: any;
  moveRefContext: any;
  // 框选识别区
  identifyArea: Array<Object> = []; // 坐标
  identifyTextList: Array<string> = []; // 识别结果
  identifyObject: any = []; // 字段名，字段类型，识别结果
  idenNormalBtn: boolean = true;
  identifyClass: string = "noIdentify";

  initIdenPoint: Array<Object> = []; // 恢复原始大小step2
  identifyInit: Object = {};
  identifyParams: Object = {};
  // 移动识别区的矩形框
  isCanMoveIden: boolean = false;
  moveIdenCanvas: any;
  moveIdenContext: any;
  // 坐标值
  coordinate: Array<number> = [];
  // 自适应图片和画布的比例
  imgPercent: number = 1;
  // 窗口大小（也就是画布大小）
  screenWidth: number = document.body.clientWidth - 480;
  screenHeight: number = document.body.clientHeight - 142;

  addPer: number = 1;
  delPer: number = 1;
  // 查看初始化时画布是否绘制完毕
  isRendering: boolean = false;
  // 放大/缩小时自适应图片和原图的比例
  scalePer: number = 1;
  // 矩形框和图片的比例
  rectPercent: number = 1;

  created() {
    this.templateId = this.$route.query.id;
    this.getTemplateItem(this.$route.query.id);
    this.getFieldDefault();
  }
  // 监控窗口宽度变化
  @Watch("screenWidth", { deep: true })
  handleWidth() {
    this.resizeWidth();
  }
  // 监控窗口高度变化
  @Watch("screenHeight", { deep: true })
  handleHeight() {
    this.resizeHeight();
  }

  mounted() {
    console.log("坐标值", this.coordinate);
    // 根据窗口自适应 (浏览器窗口最小设为1200，画布的最小宽度：1200-480=720)
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth - 480;
        this.screenHeight = document.body.clientHeight - 142;
        if (this.screenWidth < 720) {
          return false;
        }
      })();
    };

    // this.canvasWrap = this.$refs.canvasWrap as HTMLDivElement;
    this.canvasWrap = document.getElementsByClassName("canvas-box");
    if (this.screenWidth > 720) {
      this.canvasBgw = this.screenWidth;
      this.canvasBgh = this.screenHeight;
    } else {
      this.canvasBgw = this.canvasWrap[0].clientWidth;
      this.canvasBgh = this.canvasWrap[0].clientHeight;
    }
  }
  // 调整窗口宽度

  // 自适应图片
  resizeImg() {
    if (this.IW > this.canvasBgw && this.IH < this.canvasBgh) {
      if (this.IW > this.IH) {
        const percent = this.canvasBgw / this.IW;
        this.IW = this.IW * percent;
        this.IH = this.IH * percent;
        console.log("自适应图片11", this.IW, this.IH);
      } else if (this.IH > this.IW) {
        const percent = this.canvasBgh / this.IH;
        this.IW = this.IW * percent;
        this.IH = this.IH * percent;
        console.log("自适应图片22", this.IW, this.IH);
      }
    } else if (this.IW > this.canvasBgw && this.IH > this.canvasBgh) {
      if (this.IW > this.IH) {
        const percent = this.canvasBgw / this.IW;
        this.IW = this.IW * percent;
        this.IH = this.IH * percent;
        console.log("自适应图片33", this.IW, this.IH);
      } else {
        const percent = this.IW / this.IH;
        this.IW = this.IW * percent;
        this.IH = this.IH * percent;
        console.log("自适应图片44", this.IW, this.IH);
      }
    } else {
      console.log("自适应图片555", this.screenWidth, this.IW, this.canvasBgw);
    }
  }

  resizeWidth() {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth - 480;
        this.screenHeight = document.body.clientHeight - 142;
      })();
    };
    this.canvasBgw = this.screenWidth;
    this.canvasBgh = this.screenHeight;
    if (this.screenWidth > 720) {
      this.canvasBgw = this.screenWidth;
      this.canvasBgh = this.screenHeight;
    } else {
      this.canvasBgw = this.canvasWrap[0].clientWidth;
      this.canvasBgh = this.canvasWrap[0].clientHeight;
    }
    if (this.canvasBgw >= 720 && this.screenWidth >= 720) {
      this.resizeImg();
      this.imgContext.clearRect(0, 0, this.canvasBgw, this.canvasBgh);
      this.imgContext.drawImage(this.IMAGE, 0, 0, this.IW, this.IH);
      this.drawImageCanvas(this.canvasBgw, this.canvasBgh, this.IW, this.IH);
      this.rectPercent = this.IW / this.IMAGE.width;
      if (this.tabIndex == 1) {
        this.renderRefRect(this.rectPercent);
      } else {
        this.renderIdenRect(this.rectPercent);
      }
    } else {
      return;
    }
  }
  // 调整窗口高度
  resizeHeight() {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth - 480;
        this.screenHeight = document.body.clientHeight - 142;
      })();
    };
    this.canvasBgw = this.screenWidth;
    this.canvasBgh = this.screenHeight;
    setTimeout(() => {
      this.imgContext.clearRect(0, 0, this.canvasBgw, this.canvasBgh);
      this.imgContext.drawImage(this.IMAGE, 0, 0, this.IW, this.IH);
      this.drawImageCanvas(this.canvasBgw, this.canvasBgh, this.IW, this.IH);
      if (this.tabIndex == 1) {
        this.renderRefRect(this.rectPercent);
      } else {
        this.renderIdenRect(this.rectPercent);
      }
    }, 500);
  }

  // "编辑"接口-回显
  async getTemplateItem(id: any) {
    const response = await ocrService.getTemplateItem(id);
    response.photo = `data:image/png;base64,${response.photo}`;
    this.coordinate = cloneDeep(response.imageWords);
    this.referenceObject = cloneDeep(response.deLocal);
    this.identifyObject = cloneDeep(response.reLocal);
    this.newName = response.name;
    this.referenceObject.forEach((item: any, key: number) => {
      let reference = {
        sw: item.bbox[0],
        sh: item.bbox[1],
        rw: item.bbox[2] - item.bbox[0],
        rh: item.bbox[5] - item.bbox[3]
      };
      this.referenceTextList.push(item.text);
      this.referenceArea.push(reference);
      this.initRefPoint.push(reference);
    });
    this.identifyObject.forEach((item: any, key: number) => {
      this.fieldName.push(item.text);
      this.fieldTypeList.push(item.type.name);
      this.identifyTextList.push(item.ocr_result);

      let a = {
        sw: item.bbox[0],
        sh: item.bbox[1],
        rw: item.bbox[2] - item.bbox[0],
        rh: item.bbox[5] - item.bbox[3]
      };
      this.identifyArea.push(a);
      this.initIdenPoint.push(a);
    });

    this.templateUrl = response.photo;
    this.templateName = response.name;
    setTimeout(() => {
      this.init(this.templateUrl);
    }, 600);
  }

  init(src: any) {
    //渲染图像
    this.IMAGE = new Image();
    this.IMAGE.src = src;
    this.IMAGE.onload = () => {
      const pixe = window.devicePixelRatio;
      console.log("图片原始大小", this.IMAGE.width, this.IMAGE.height);
      this.IW = this.IMAGE.width * pixe;
      this.IH = this.IMAGE.height * pixe;

      this.imgCanvas = document.getElementById(
        "itemcanvans"
      ) as HTMLCanvasElement;
      this.imgContext = this.imgCanvas.getContext("2d");

      this.moveRefCanvas = document.getElementById(
        "itemcanvans"
      ) as HTMLCanvasElement;
      this.moveRefContext = this.moveRefCanvas.getContext("2d");

      this.moveIdenCanvas = document.getElementById(
        "itemcanvans"
      ) as HTMLCanvasElement;
      this.moveIdenContext = this.moveIdenCanvas.getContext("2d");
      this.resizeImg();
      this.drawImageCanvas(this.canvasBgw, this.canvasBgh, this.IW, this.IH);
      this.imgOriginalW = this.IW;
      this.imgOriginalH = this.IH;
      this.isRendering = true;
      this.imgPercent = this.IW / this.IMAGE.width;
      this.rectPercent = this.IW / this.IMAGE.width;
      console.log("图片绘制后的大小", this.IH);

      // 此代码可以看到可视化的初始坐标
      // this.coordinate.forEach((item:any, key: number) =>{
      //   item.rect.left = item.rect.left * this.imgPercent;
      //   item.rect.top = item.rect.top * this.imgPercent;
      //   item.rect.width = item.rect.width * this.imgPercent;
      //   item.rect.height = item.rect.height * this.imgPercent;
      //   this.imgContext.strokeStyle = "#FF4955";
      //   this.imgContext.lineWidth = 1;
      //   this.imgContext.strokeRect(item.rect.left, item.rect.top,item.rect.width, item.rect.height);
      // })

      // 如果有编辑的数据
      if (this.referenceArea.length !== 0) {
        this.renderRefRect(this.rectPercent);
      }
    };
  }

  // 移动
  moveCanvas() {
    this.clearStyle(true, false, false);
    this.imgCanvas.style.cursor = "move";
    let edx: number = 0;
    let edy: number = 0;

    this.imgCanvas.onmousedown = (ed: any) => {
      ed.preventDefault();
      this.isCanMove = true;
      this.strokeRef = !this.isCanMove;
      edx = ed.offsetX;
      edy = ed.offsetY;
    };
    this.imgCanvas.onmousemove = (em: any) => {
      em.preventDefault();
      if (this.isCanMove == true) {
        this.strokeRef = !this.isCanMove;
        this.imgLeft = this.imgLeft + (em.offsetX - edx);
        this.imgTop = this.imgTop + (em.offsetY - edy);
        const offsetx = this.imgLeft + (em.offsetX - edx);
        const offsey = this.imgTop + (em.offsetY - edy);
        const maxLeft = this.canvasBgw - this.IW;
        const maxTop = this.canvasBgh - this.IH;

        this.imgCanvas.style.left = this.imgLeft + "px";
        this.imgCanvas.style.top = this.imgTop + "px";
        // 四个边界判断
        // if (offsetx < 0 || offsey < 0 || offsetx > maxLeft || offsey > maxTop) {
        //   this.isCanMove = false;
        // } else {
        //   this.isCanMove = true;
        //   this.imgCanvas.style.left = this.imgLeft + "px";
        //   this.imgCanvas.style.top = this.imgTop + "px";
        // }
      }
    };
    this.imgCanvas.onmouseleave = (el: any) => {
      el.preventDefault();
      this.isCanMove = false;
      this.strokeRef = this.isCanMove;
    };
    this.imgCanvas.onmouseup = (eu: any) => {
      eu.preventDefault();
      this.isCanMove = false;
      this.strokeRef = this.isCanMove;
    };
  }

  // 放大、缩小
  scaleEvent(flag: number) {
    this.changeScale = 1;
    if (this.templateUrl == "") return;
    if (this.canvasBgw - 20 <= this.IW && flag == 1) {
      this.$message.warning("图片已经是最大");
      flag = -2;
      return;
    }
    if (this.canvasBgh - 50 < this.IH && flag == 1) {
      this.$message.warning("图片已经是最大!");
      flag = -2;
      return;
    }
    if (flag == 1) {
      this.changeScale = 1.05;
      this.IW = this.IW * this.changeScale;
      this.IH = this.IH * this.changeScale;
      this.scalePer = this.IW / this.imgOriginalW;
      this.rectPercent = this.IW / this.imgOriginalW;

      this.drawImageByScale();
    } else if (flag == -1) {
      if (this.IW <= 400) {
        this.$message.warning("图片已经是最小");
        return;
      }
      this.changeScale = 0.95;
      this.IW = this.IW * this.changeScale;
      this.IH = this.IH * this.changeScale;
      this.scalePer = this.IW / this.imgOriginalW;
      this.rectPercent = this.IW / this.imgOriginalW;
      this.drawImageByScale();
    }
  }

  // 框选区随放大/缩小而放大/缩小
  drawImageByScale() {
    this.drawImageCanvas(this.canvasBgw, this.canvasBgh, this.IW, this.IH);
    if (this.referenceArea.length !== 0) {
      this.referenceArea.forEach((item: any, index: any) => {
        const a = {
          sw: this.scalePer * item.sw,
          sh: this.scalePer * item.sh,
          rw: this.scalePer * item.rw,
          rh: this.scalePer * item.rh
        };
        item = a;
        if (this.tabIndex == 1) {
          canvasTS.drawReferenceRect(this.imgContext, item);
        }
      });
    }
    if (this.identifyArea.length !== 0) {
      this.identifyArea.forEach((item: any, index: any) => {
        const a = {
          sw: this.scalePer * item.sw,
          sh: this.scalePer * item.sh,
          rw: this.scalePer * item.rw,
          rh: this.scalePer * item.rh
        };
        item = a;
        if (this.tabIndex == 2) {
          canvasTS.drawIdenRect(this.imgContext, item);
        }
      });
    }
  }

  drawImageCanvas(
    canvasW: number,
    canvasH: number,
    imgW: number,
    imgH: number
  ) {
    this.imgCanvas.setAttribute("width", imgW);
    this.imgCanvas.setAttribute("height", imgH);
    this.imgLeft = canvasW / 2 - imgW / 2;
    this.imgTop = canvasH / 2 - imgH / 2;
    this.imgCanvas.style.left = this.imgLeft + "px";
    this.imgCanvas.style.top = this.imgTop + "px";
    this.imgContext.clearRect(0, 0, canvasW, this.canvasBgh);
    this.imgContext.drawImage(this.IMAGE, 0, 0, imgW, imgH);
  }

  // 原始大小
  rebackDef() {
    this.scalePer = 1;
    this.rectPercent = 1;
    this.drawImageCanvas(
      this.canvasBgw,
      this.canvasBgh,
      this.imgOriginalW,
      this.imgOriginalH
    );
    this.IW = this.imgOriginalW;
    this.IH = this.imgOriginalH;

    this.referenceObject.forEach((item: any, key: number) => {
      let ref = {
        sw: item.bbox[0],
        sh: item.bbox[1],
        rw: item.bbox[2] - item.bbox[0],
        rh: item.bbox[5] - item.bbox[3]
      };
      this.referenceArea[key] = ref;
    });
    if (this.referenceArea.length !== 0 && this.tabIndex == 1) {
      this.renderRefRect(this.imgPercent);
    }

    this.identifyObject.forEach((item: any, key: number) => {
      let iden = {
        sw: item.bbox[0],
        sh: item.bbox[1],
        rw: item.bbox[2] - item.bbox[0],
        rh: item.bbox[5] - item.bbox[3]
      };
      this.identifyArea[key] = iden;
    });
    if (this.identifyArea.length !== 0 && this.tabIndex == 2) {
      this.renderIdenRect(this.imgPercent);
    }
  }

  // 绘制参照区的矩形框
  renderRefRect(percent: number) {
    this.referenceArea.forEach((item: any, index: any) => {
      const a = {
        sw: percent * item.sw,
        sh: percent * item.sh,
        rw: percent * item.rw,
        rh: percent * item.rh
      };
      item = a;
      canvasTS.drawReferenceRect(this.imgContext, item);
    });
  }
  // 绘制识别区的矩形框
  renderIdenRect(percent: number) {
    this.identifyArea.forEach((item: any, index: any) => {
      const a = {
        sw: percent * item.sw,
        sh: percent * item.sh,
        rw: percent * item.rw,
        rh: percent * item.rh
      };
      item = a;
      canvasTS.drawIdenRect(this.imgContext, item);
    });
  }

  tableClick() {
    console.log("点击了表格");
  }
  // 识别表格
  showInputNum(boolean: boolean) {
    this.fadeNumber = boolean;
  }
  // 插入表格数量
  confirmNumber() {
    const num = Number(this.numberVal);
    for (let a = 0; a < num; a++) {
      this.identifyArea[a] = a;
    }
  }

  // 清除样式
  clearStyle(move: boolean, ref: boolean, iden: boolean) {
    // 移动按钮
    if (move == true && ref == false && iden == false) {
      this.moveClass = "moveBtn";
      this.moveNormalBtn = false;
    } else {
      this.moveClass = "noMove";
      this.moveNormalBtn = true;
    }
    // 框选区
    if (this.tabIndex == 1 && ref == true) {
      this.refNormalBtn = false;
      this.referenceClass = "rectChoose";
      this.idenNormalBtn = true;
      this.identifyClass = "noIdentify";
    } else if (this.tabIndex == 2 && iden == true) {
      this.idenNormalBtn = false;
      this.identifyClass = "rectIdentify";
      this.refNormalBtn = true;
      this.referenceClass = "noRectChoose";
    } else {
      this.idenNormalBtn = true;
      this.identifyClass = "noIdentify";
      this.refNormalBtn = true;
      this.referenceClass = "noRectChoose";
    }
  }

  // 框选: 参照区/识别区
  drawRectArea(rect1: boolean, rect2: boolean) {
    this.clearStyle(false, true, true);
    this.clearArea(this.canvasWrap);

    let [startX, startY, changex, changey, rw, rh] = [0, 0, 0, 0, 0, 0];
    let [dw, dh] = [0, 0];
    let [rectaw, rectah, rectdw, rectdh] = [0, 0, 0, 0];

    let downPoint = {
      sw: 0,
      sh: 0
    };

    this.imgCanvas.onmousedown = (ed: any) => {
      [startX, startY, changex, changey, rw, rh] = [0, 0, 0, 0, 0, 0];
      [rectaw, rectah, rectdw, rectdh] = [0, 0, 0, 0];
      downPoint = {
        sw: ed.offsetX,
        sh: ed.offsetY
      };
      if (this.tabIndex == 1 && this.referenceArea.length < 20) {
        this.strokeRef = rect1;
        this.strokeIden = false;
      } else {
        this.strokeRef = false;
      }
      if (this.tabIndex == 2) {
        this.strokeIden = rect2;
        this.strokeRef = false;
      }
    };

    this.imgCanvas.onmousemove = (em: any) => {
      this.imgCanvas.style.cursor = "pointer";
      startX = downPoint.sw;
      startY = downPoint.sh;
      rectaw = downPoint.sw;
      rectah = downPoint.sh;

      // 只有布尔值为true， 才可改变 changex、changey、rw、rh， 不要提取公共部分内容
      if (this.strokeRef == true) {
        changex = em.offsetX;
        changey = em.offsetY;
        rw = changex - startX;
        rh = changey - startY;
        rectdw = changex - startX;
        rectdh = changey - startY;
        this.clearContext(this.IMAGE, 0, 0, this.IW, this.IH);
        if (this.tabIndex == 1) {
          this.strokeIden = false;
          if (this.referenceArea.length !== 0) {
            this.renderRefRect(this.rectPercent);
          }
          canvasTS.drawCurrentRef(this.imgContext, startX, startY, rw, rh);
        }
      }

      if (this.strokeIden == true) {
        changex = em.offsetX;
        changey = em.offsetY;
        rw = changex - startX;
        rh = changey - startY;
        rectdw = changex - startX;
        rectdh = changey - startY;
        this.clearContext(this.IMAGE, 0, 0, this.IW, this.IH);
        if (this.tabIndex == 2) {
          this.strokeRef = false;
          if (this.identifyArea.length !== 0) {
            this.renderIdenRect(this.rectPercent);
          }
          canvasTS.drawCurrentIden(this.imgContext, startX, startY, rw, rh);
        }
      }
    };

    this.imgCanvas.onmouseup = (eu: any) => {
      // 图片大小不等于原始大小时
      if (this.IW !== this.imgOriginalW) {
        if (this.IW > this.imgOriginalW) {
          // 大于原始图时的比例值
          const per = this.imgOriginalW / this.IW;
          [startX, startY] = [startX * per, startY * per];
          [rw, rh] = [rw * per, rh * per];
          [dw, dh] = [eu.offsetX * per, eu.offsetY * per];
        } else {
          // 小于原始图时的比例值
          const per = this.IW / this.imgOriginalW;
          [startX, startY] = [startX / per, startY / per];
          [rw, rh] = [rw / per, rh / per];
          [dw, dh] = [eu.offsetX / per, eu.offsetY / per];
        }
      } else {
        [dw, dh] = [eu.offsetX, eu.offsetY];
      }

      this.strokeRef = false;
      this.strokeIden = false;
      this.cutImgSrc = "";
      if (rw !== 0) {
        let a = {
          sw: rectaw / this.rectPercent,
          sh: rectah / this.rectPercent,
          rw: rectdw / this.rectPercent,
          rh: rectdh / this.rectPercent
        };
        const init = {
          sw: rectaw / this.rectPercent,
          sh: rectah / this.rectPercent,
          rw: rectdw / this.rectPercent,
          rh: rectdh / this.rectPercent
        };
        this.identifyInit = init;
        this.objReference = a;

        this.cutImgSrc = this.startClip(a);
        const files: any = fileConversion.dataURLtoFile(
          this.cutImgSrc,
          this.templateName
        );
        const fileForm = new FormData();
        fileForm.append("photo", files);
        // 请求接口的识别方法
        // this.getOcrResult(fileForm);

        // 不用请求接口的识别方法
        startX = startX / this.imgPercent;
        startY = startY / this.imgPercent;
        dw = dw / this.imgPercent;
        dh = dh / this.imgPercent;
        rw = rw / this.imgPercent;
        rh = rh / this.imgPercent;
        //反选时
        if (rw < 0 && rh < 0) {
          startX = startX + rw;
          startY = startY + rh;
          dw = startX + Math.abs(rw);
          dh = startY + Math.abs(rh);
        }
        const bbox = [startX, startY, dw, startY, dw, dh, startX, dh];
        console.log("bbox的值", bbox);
        const param1 = {
          text: "",
          bbox: bbox
        };
        const param2 = {
          text: "",
          bbox: bbox,
          type: {
            name: "",
            flag: false,
            dict: []
          }
        };
        this.referenceParams = param1;
        this.identifyParams = param2;

        // 不用请求接口的识别方法
        const coor = {
          left: startX,
          top: startY,
          width: Math.abs(rw),
          height: Math.abs(rh)
        };
        this.getWords(coor);
      }
    };

    this.imgCanvas.onmouseleave = () => {
      this.strokeIden = false;
      this.strokeRef = false;
    };
  }

  // 自动识别
  getWords(coor: any) {
    console.log("传进来的坐标", coor);
    const words = ocrResult.getWords(this.coordinate, coor);
    console.log("识别结果words", words);
    if (this.tabIndex == 1) {
      this.referenceTextList.push(words);
      this.referenceArea.push(this.objReference);
      this.initRefPoint.push(this.identifyInit);
      this.referenceObject.push(this.referenceParams);
    } else if (this.tabIndex == 2) {
      this.identifyTextList.push(words);
      this.identifyArea.push(this.objReference);
      this.initIdenPoint.push(this.identifyInit);
      this.identifyObject.push(this.identifyParams);
      // 默认选中'常规'
      this.fieldTypeList.push("常规");
    }
  }

  // ocr识别接口
  async getOcrResult(params: any) {
    const response = await ocrService.getOcrResult(params);
    cache.localSet("identifyError", 200);
    if (cache.localGet("identifyError") == 200) {
      let str = "";
      response.forEach((val: any, key: number) => {
        str += `${val.text}`;
      });
      if (this.tabIndex == 1) {
        this.referenceTextList.push(str);
        this.referenceArea.push(this.objReference);
        this.initRefPoint.push(this.identifyInit);
        this.referenceObject.push(this.referenceParams);
      } else if (this.tabIndex == 2) {
        this.identifyTextList.push(str);
        this.identifyArea.push(this.objReference);
        this.initIdenPoint.push(this.identifyInit);
        this.identifyObject.push(this.identifyParams);
      }
    }
  }
  // 删除识别区域item
  delIdentifyItem(index: number) {
    this.identifyObject.splice(index, 1);
    this.identifyArea.splice(index, 1);
    this.identifyTextList.splice(index, 1);
    this.fieldName.splice(index, 1);
    this.clearContext(this.IMAGE, 0, 0, this.IW, this.IH);
    this.renderIdenRect(this.rectPercent);
  }
  // 删除参照区域item
  delReferenceItem(index: number) {
    this.referenceArea.splice(index, 1);
    this.referenceTextList.splice(index, 1);
    this.referenceObject.splice(index, 1);
    this.clearContext(this.IMAGE, 0, 0, this.IW, this.IH);
    this.renderRefRect(this.rectPercent);
  }
  // 切换tab
  changeTab(key: any) {
    this.tabIndex = key;
    this.strokeRef = false;
    this.clearStyle(false, false, false);
    this.drawArray();
    this.imgCanvas.style.cursor = "pointer";
    this.moveRefCanvas.style.cursor = "pointer";
    this.moveIdenCanvas.style.cursor = "pointer";

    if (this.tabIndex == 2) {
      this.isCanMoveRef = false;
      this.clearArea(this.moveRefCanvas);
    } else {
      this.isCanMoveIden = false;
      this.clearArea(this.moveIdenCanvas);
    }
  }

  clearArea(area: any) {
    area.onmousedown = (ed: any) => {
      let drag = false;
      area.onmousemove = (em: any) => {};
      area.onmouseleave = () => {
        drag = false;
      };
      area.onmouseup = () => {
        drag = false;
      };
    };
  }

  clearContext(img: any, isw: number, ish: number, iw: number, ih: number) {
    this.imgContext.clearRect(0, 0, iw, ih);
    this.imgContext.drawImage(img, isw, ish, iw, ih);
  }

  drawArray() {
    this.clearContext(this.IMAGE, 0, 0, this.IW, this.IH);
    if (this.referenceArea.length !== 0 && this.tabIndex == 1) {
      this.renderRefRect(this.rectPercent);
    }
    if (this.identifyArea.length !== 0 && this.tabIndex == 2) {
      this.renderIdenRect(this.rectPercent);
    }
  }

  // 参照区：高亮
  lightUpRef(val: any, index: number) {
    const a = {
      sw: this.rectPercent * val.sw,
      sh: this.rectPercent * val.sh,
      rw: this.rectPercent * val.rw,
      rh: this.rectPercent * val.rh
    };
    val = a;
    const color = "rgba(46,187,161,0.6)";
    // 避免页面刚加载进来时控制台出现warning信息
    if (this.isRendering == true) {
      canvasTS.lightUpArea(this.imgContext, val, color);
    }
  }
  // 参照区：取消高亮
  cancelLightRef(index: number) {
    this.imgContext.clearRect(0, 0, this.canvasBgw, this.canvasBgh);
    this.imgContext.drawImage(this.IMAGE, 0, 0, this.IW, this.IH);
    this.renderRefRect(this.rectPercent);
  }
  // 识别区：高亮
  lightUpIden(val: any, index: number) {
    const a = {
      sw: this.rectPercent * val.sw,
      sh: this.rectPercent * val.sh,
      rw: this.rectPercent * val.rw,
      rh: this.rectPercent * val.rh
    };
    val = a;
    const color = "rgba(24,144,255,0.6)";
    canvasTS.lightUpArea(this.imgContext, val, color);
  }
  // 识别区：取消高亮
  cancelLightIden(index: number) {
    this.optionArrow = true;
    this.imgContext.clearRect(0, 0, this.IW, this.IH);
    this.imgContext.drawImage(this.IMAGE, 0, 0, this.IW, this.IH);
    this.renderIdenRect(this.rectPercent);
  }

  startClip(area: any) {
    const canvas2 = document.createElement("canvas");
    const canvas2CTX: any = canvas2.getContext("2d");
    canvas2.width = area.rw;
    canvas2.height = area.rh;
    const data = this.imgContext.getImageData(
      area.sw,
      area.sh,
      area.rw,
      area.rh
    );
    canvas2CTX.putImageData(data, 0, 0);
    return canvas2.toDataURL("image/png", 1);
  }

  // 展示裁剪弹窗
  clipEvent() {
    this.clipVisible = true;
    this.clipWP = 1;
    this.clipHP = 1;
    this.IMAGE.src = this.templateUrl;
    setTimeout(() => {
      const clipContext: any = document.getElementById(
        "clipCanvas"
      ) as HTMLCanvasElement;
      this.clipDrawImage = clipContext.getContext("2d");
      const clipDraw = clipContext.getContext("2d");

      let [csw, csh] = [0, 0];
      this.CIW = this.IW;
      this.CIH = this.IH;

      if (this.CIW > this.clipwidth) {
        if (this.CIW > this.CIH) {
          const r = (this.clipwidth - 10) / this.CIW;
          this.CIW = this.CIW * r;
          this.CIH = this.CIH * r;
          console.log("111");
        } else if (this.CIH > this.CIW) {
          const r = (this.clipheight - 10) / this.CIH;
          this.CIW = this.CIW * r;
          this.CIH = this.CIH * r;
          console.log("222");
        }
      }
      this.clipWP = (this.CIW + 10) / this.imgOriginalW;
      this.clipHP = (this.CIH + 10) / this.imgOriginalH;

      csw = this.clipwidth / 2 - this.CIW / 2;
      csh = this.clipheight / 2 - this.CIH / 2;
      // 绘制裁剪框
      let msw = this.clipwidth / 2 - this.CIW / 2;
      let msh = this.clipheight / 2 - this.CIH / 2;
      let mrx = this.CIW;
      let mry = this.CIH;
      // 变化的裁剪框
      let [isw, ish, imgw, imgh] = [csw, csh, this.CIW, this.CIH];

      canvasTS.drawTrim(
        msw,
        msh,
        mrx,
        mry,
        clipDraw,
        this.clipwidth,
        this.clipheight
      );
      clipDraw.drawImage(this.IMAGE, csw, csh, this.CIW, this.CIH);
      canvasTS.drawClip(
        clipContext,
        msw,
        msh,
        mrx,
        mry,
        clipDraw,
        imgw,
        imgh,
        this.IMAGE,
        this.CIW,
        this.CIH,
        isw,
        ish,
        csw,
        csh,
        this.clipwidth,
        this.clipheight,
        clipDraw,
        this.clipArea,
        this.clipDrag
      );
    }, 500);
  }

  // 裁剪-ok
  confirmClip() {
    this.isCliped = false;
    this.isCliped = canvasTS.isCliped();
    if (this.isCliped == true) {
      this.clipArea = canvasTS.changeClipArea();
      this.clipArea.x = this.clipArea.x / this.clipWP;
      this.clipArea.y = this.clipArea.y / this.clipHP;
      this.clipArea.w = this.clipArea.w / this.clipWP;
      this.clipArea.h = this.clipArea.h / this.clipHP;

      this.clipUrl = this.clipImage(this.clipArea);
      this.templateUrl = this.clipUrl;
      this.clipVisible = false;
      const files: any = fileConversion.dataURLtoFile(
        this.clipUrl,
        this.templateName
      );
      const formParams = new FormData();
      formParams.append("photo", files);
      formParams.append("_id", this.templateId);
      this.uploadImage(formParams);
    } else {
      this.clipVisible = false;
    }

    // this.init(this.clipUrl);
  }

  // 裁剪-ok-生成新的图片
  clipImage(area: any) {
    const canvas2 = document.createElement("canvas");
    const canvas2CTX: any = canvas2.getContext("2d");
    canvas2.width = area.w;
    canvas2.height = area.h;
    // let sw = this.clipwidth / 2 - this.CIW / 2;
    // let sh = this.clipheight / 2 - this.CIH / 2;

    // this.clipDrawImage.clearRect(0, 0, this.clipwidth, this.clipheight);
    // canvas2CTX.drawImage(this.IMAGE, sw, sh, this.IW, this.IH);
    const data = this.imgContext.getImageData(area.x, area.y, area.w, area.h);
    canvas2CTX.putImageData(data, 0, 0);
    return canvas2.toDataURL("image/png", 1);
  }
  // 裁剪-取消
  cancelClip() {
    this.clipUrl = "";
    this.isCliped = false;
  }

  // 展示旋转弹窗
  rotateEvent() {
    this.IMAGE.src = this.templateUrl;
    this.rotateVisible = true;
    setTimeout(() => {
      const modalCanvas: any = document.getElementById(
        "rotateCanvas"
      ) as HTMLCanvasElement;
      const modalCtx = modalCanvas.getContext("2d");
      let [sw, sh] = [0, 0];
      [this.RIW, this.RIH] = [this.IW, this.IH];
      if (this.RIW > this.rotatew) {
        if (this.RIW > this.RIH) {
          const r = this.rotatew / 2 / this.RIW;
          this.RIW = this.RIW * r;
          this.RIH = this.RIH * r;
        } else if (this.RIH > this.RIW) {
          const r = this.rotateh / 2 / this.RIH;
          this.RIW = this.RIW * r;
          this.RIH = this.RIH * r;
        }
      }
      sw = this.rotatew / 2 - this.RIW / 2;
      sh = this.rotateh / 2 - this.RIH / 2;
      modalCtx.clearRect(0, 0, this.rotatew, this.rotateh);
      modalCtx.drawImage(this.IMAGE, sw, sh, this.RIW, this.RIH);
    }, 500);
  }
  // 滑动任意角度
  sliderChange(value: any) {
    this.sliderVal = value;
    const modalCanvas: any = document.getElementById(
      "rotateCanvas"
    ) as HTMLCanvasElement;
    const modalCtx = modalCanvas.getContext("2d");
    let [sourceW, sourceH] = [0, 0];
    if (this.RIW > this.rotatew) {
      sourceW = 0;
      sourceH = 0;
    } else {
      sourceW = this.rotatew / 2 - this.RIW / 2;
      sourceH = this.rotateh / 2 - this.RIH / 2;
    }
    modalCtx.clearRect(0, 0, this.rotatew, this.rotateh);
    modalCtx.save();
    modalCtx.translate(this.rotatew / 2, this.rotateh / 2);
    modalCtx.rotate((value * Math.PI) / 180);
    modalCtx.translate(-this.rotatew / 2, -this.rotateh / 2);
    modalCtx.drawImage(this.IMAGE, sourceW, sourceH, this.RIW, this.RIH);
    modalCtx.restore();
    // this.rotateUrl = modalCanvas.toDataURL("image/png", 1);
  }
  // 旋转的确认
  rotateConfirm() {
    if (this.sliderVal !== 0) {
      //根据勾股定理获取斜边长
      const maxLength = Math.sqrt(
        this.imgOriginalW ** 2 + this.imgOriginalH ** 2
      );
      this.imgCanvas.setAttribute("width", maxLength);
      this.imgCanvas.setAttribute("height", maxLength);
      this.imgContext.clearRect(0, 0, maxLength, maxLength);
      this.imgContext.save();
      this.imgContext.translate(maxLength / 2, maxLength / 2);
      this.imgContext.rotate((this.sliderVal * Math.PI) / 180);
      this.imgContext.translate(-maxLength / 2, -maxLength / 2);
      this.imgLeft = this.canvasBgw / 2 - maxLength / 2;
      this.imgTop = this.canvasBgh / 2 - maxLength / 2;
      this.imgCanvas.style.left = this.imgLeft + "px";
      this.imgCanvas.style.top = this.imgTop + "px";

      this.imgContext.drawImage(
        this.IMAGE,
        (maxLength - this.imgOriginalW) / 2,
        (maxLength - this.imgOriginalH) / 2,
        this.imgOriginalW,
        this.imgOriginalH
      );
      this.rotateUrl = this.imgCanvas.toDataURL("image/png", 1);
      this.init(this.rotateUrl);
    }
    this.rotateVisible = false;
    this.sliderVal = 0;
    this.rotateUrl = "";
  }

  // input规则提示语
  inputChange(val: any, index: number) {
    if (val == "") {
      this.inputTip = true;
    } else {
      this.inputTip = false;
    }
  }
  // 更新图片
  changeImage() {
    this.changeImgVisible = true;
  }
  // 更新名字
  changeName() {
    this.newName = this.templateName;
    this.nameVisible = true;
  }
  nameConfirm() {
    if (this.newName == "") return;
    const param = {
      _id: this.templateId,
      name: this.newName
    };
    this.changeTemItem(param);
    this.nameVisible = false;
  }

  // 更改名称
  async changeTemItem(params: any) {
    const response = await ocrService.changeTemItem(params);
    this.templateName = response.name;
    this.$message.success("更改成功！");
  }

  // "试一试"
  trialTem() {
    this.arrayParam("试一试");
  }

  // "试一试" 图片
  async changeTemImage(params: any) {
    const response = await ocrService.changeTemItem(params);
    this.trialVisible = true;
  }
  // "试一试"上传图片
  async uploadTemImage(file: any) {
    if (fitImgSuffix(file.file.name, true)) {
      const errorMsg = fitImgSuffix(file.file.name, true);
      this.$message.error(`${errorMsg}`);
      return;
    }
    file.preview = await fileConversion.getBase64(file.file);
    this.trialPreviewImage = file.preview;
    const temForm = new FormData();
    temForm.append("photo", file.file);
    temForm.append("templateSign", this.templateId);
    this.trialUploadImage(temForm);
    this.trialLoading = true;

    if (this.trialData.length !== 0) {
      this.trialLoading = false;
    } else {
      setTimeout(() => {
        this.trialLoading = false;
      }, 3000);
    }
  }
  // "试一试"上传接口
  async trialUploadImage(params: any) {
    const response = await ocrService.trialUploadImage(params);
    this.trialLoading = false;
    this.trialResponse = response;
    this.trialData = cloneDeep(response);
  }

  // "试一试"重新选择
  tryAgain() {
    this.trialPreviewImage = "";
    this.trialData = [];
    this.trialResponse = {};
  }

  // '更改模板图片'-upload
  async uploadCreateImage(file: any) {
    if (fitImgSuffix(file.file.name, true)) {
      const errorMsg = fitImgSuffix(file.file.name, true);
      this.$message.error(`${errorMsg}`);
      return;
    }
    file.preview = await fileConversion.getBase64(file.file);
    const size = file.file.size / 1024 / 1024;
    const img = new Image();
    img.src = file.preview;
    img.onload = () => {
      if (img.width > 2048 || img.height > 2048) {
        this.$message.error("最长边不能超过2048px");
        return;
      } else if (size > 4) {
        this.$message.error("图片大小不能超过4M");
        return;
      } else {
        this.modalPreviewImage = file.preview;
        this.uploadParams = new FormData();
        this.uploadParams.append("photo", file.file);
        this.uploadParams.append("_id", this.templateId);
      }
    };
  }
  // '更改模板图片'- upload
  async uploadImage(params: any) {
    const response = await ocrService.uploadImage(params);
    location.reload();
  }
  // '更改模板图片'- 确认
  confirmBtn() {
    if (this.modalPreviewImage == "") {
      this.$message.error("请上传图片!");
      return;
    }
    this.uploadImage(this.uploadParams);
    this.changeImgVisible = false;
  }
  // '更改模板图片'- 重新选择
  toChooseBtn() {
    this.modalPreviewImage = "";
  }

  // 字段接口
  async getFieldDefault() {
    const response = await ocrService.getFieldDefault();
    if (JSON.stringify(response.myType) !== "{}") {
      this.fieldOption = response.type;
      this.myType = response.myType;
    } else {
      this.secondMenu = false;
      response.type.forEach((item: any, index: number) => {
        if (item == "我的字段类型") {
          delete response.type[index];
        } else {
          this.fieldOption.push(item);
        }
      });
    }
  }

  // "保存"
  saveEvent() {
    this.arrayParam("保存");
  }
  //  "保存"接口
  async saveTemData(params: any) {
    const response = await ocrService.changeTemItem(params);
    this.saveVisible = true;
  }
  // "暂存成功"-ok
  saveSuccess() {
    this.saveVisible = false;
  }
  // "暂存成功"-cancel
  backTemList() {
    this.$router.go(-1);
  }
  arrayParam(name: string) {
    if (this.referenceObject.length < 4) {
      this.$message.error("请至少设置4个参照字段");
      return;
    }
    if (this.identifyObject.length < 1) {
      this.$message.error("请至少设置1个识别区");
      return;
    }
    const param = {
      _id: this.templateId,
      deLocal: [],
      reLocal: []
    };

    this.referenceArea.forEach((value: any, key: number) => {
      if (this.referenceTextList[key] == "") {
        this.$message.error("框选区内未识别到内容，请修改或重新选区");
        return false;
      } else {
        this.referenceObject[key]["text"] = this.referenceTextList[key];
        param.deLocal = this.referenceObject;
      }
    });
    const a = this.referenceArea.filter((value: any, key: number) => {
      return this.referenceTextList[key] == "";
    });
    this.identifyArea.forEach((value: any, key: number) => {
      delete this.identifyObject[key].ocr_result;
      this.identifyObject[key]["text"] = this.fieldName[key];
      this.identifyObject[key].type.name = this.fieldTypeList[key];
      if (this.identifyObject[key].type.name == undefined) {
        this.$message.error("请选择字段类型");
        return;
      } else if (
        this.identifyObject[key].text == undefined ||
        this.identifyObject[key].text == ""
      ) {
        this.$message.error("请输入字段名称");
        return;
      } else {
        param.reLocal = this.identifyObject;
      }
    });
    const b = this.identifyArea.filter((value: any, key: number) => {
      return (
        this.identifyObject[key].text == undefined ||
        this.identifyObject[key].text == ""
      );
    });
    if (JSON.stringify(a) !== "[]") return;
    if (JSON.stringify(b) !== "[]") return;
    if (
      param.deLocal.length !== 0 &&
      param.reLocal.length !== 0 &&
      name == "保存"
    ) {
      this.saveTemData(param);
    }
    if (
      param.deLocal.length !== 0 &&
      param.reLocal.length !== 0 &&
      name == "发布"
    ) {
      this.saveRelease(param);
    }
    if (
      param.deLocal.length !== 0 &&
      param.reLocal.length !== 0 &&
      name == "试一试"
    ) {
      this.changeTemImage(param);
    }
  }

  // "发布"
  releaseEvent() {
    this.arrayParam("发布");
  }
  // 点击发布的同时也保存
  async saveRelease(params: any) {
    const response = await ocrService.changeTemItem(params);
    const param = {
      _id: this.templateId,
      status: "1"
    };
    this.releaseTemItem(param);
  }

  // "发布"接口
  async releaseTemItem(params: any) {
    const response = await ocrService.releaseTemItem(params);
    this.releaseVisible = true;
  }
  // "发布成功"-ok
  releaseSuccess() {
    this.releaseVisible = false;
  }
  // 字段类型
  handleChange(index: any, item: any) {
    this.identifyObject[index]["type"].name = item;
  }
  // 字段名字
  fieldInput(index: any) {
    this.fieldName[index] = this.fieldName[index].replace(/\s+/g, "");
    if (this.fieldName[index].length !== 0) {
      this.identifyObject[index].text = [this.fieldName[index]];
    }
  }
  // 动态设置option向上/向下
  clickOption(e: any, show: boolean, index: number) {
    this.optionArrow = false;
    if (e.target.getBoundingClientRect().bottom > this.screenHeight - 100) {
      this.optionClass = "dropDown";
    } else {
      this.optionClass = "optionStyle";
    }
    this.showOption(show, index);
  }
  showOption(show: boolean, index: number) {
    if (show == true) {
      this.fieldIndex = index;
    } else {
      this.fieldIndex = -1;
    }
  }
  fieldChange(index: number, sItem: any) {
    this.fieldTypeList[index] = sItem;
    this.fieldIndex = -1;
  }
  showSecondMenu(index: number, sItem: any) {
    this.secondMenu = true;
  }
  showThirdMenu(index: number, myIndex: any, myItem: any) {
    this.secondMenu = false;
    this.fieldIndex = -1;
    this.fieldTypeList[index] = myIndex;
    this.identifyObject[index].type.dict = myItem;
  }

  showPop1(boolean: boolean) {
    this.showPopBox1 = boolean;
  }
  showPop2(boolean: boolean) {
    this.showPopBox2 = boolean;
  }
  // 返回
  toListPage() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "./css/templateEdit.scss";
</style>
