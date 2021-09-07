import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";
import cache from "@/utils/cache";
import user from "@/store/user";
const Loginnoverify = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user/login/no-verify", params);
const userLogin = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user/login", params);

const userLogout = (): AxiosPromise =>
  fetch.get("/v1/user-manager/user/login-out");

const register = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user/regist", params);

// 用户注册
// 第一步判断信息
const registerFirstStep = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user/judge", params);

const userRegister = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user", params);

const getVerify = (): AxiosPromise =>
  fetch.get("/v1/user-manager/user/verifyCode");

const getUserInfo = (params: string): AxiosPromise =>
  fetch.get(`/v1/user-manager/user/auth/${params}`);

// AI能力下拉菜单
const getApiNavMenu = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/runnable-list`);
// 行业应用下拉菜单
const getIndustryNavMenu = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/industry/runnable-list`);
//首页跳转到 行业应用详情   /v1/service-manager/industry/detail/
const getIndustryDetail = (name: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/industryClass/detail/${name}`);
// 行业应用详情页
const getApplicationDetail = (name: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/industry/detail/${name}`);
// 手机版、平板版下载次数
const getIndustryDownload = (id: number): AxiosPromise =>
  fetch.put(`/v1/service-manager/industry/download-count/${id}`);

// 合作咨询
const postConsult = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/consult", params);
// 修改密码
const changePwd = (params: any): AxiosPromise =>
  fetch.put("/v1/user-manager/user/password", params);
// 发送邮箱
const sendMail = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user/email-verify", params);
// 修改用户信息
// const updateUserInfo = (params: any): AxiosPromise =>
//   fetch.put("/v1/user-manager/user", params);
const updateUserInfo = (id: number, params: any): AxiosPromise =>
  fetch.put(`/v1/user-manager/user/${id}`, params);

const getAuthList = (id: number, params: any): AxiosPromise =>
  fetch.get(`/v1/user-manager/oauth/client-info/${id}`, { params });

const getOrderList = (userId: string, params: any): AxiosPromise =>
  fetch.get(`/v1/bill-service/order/user/${userId}`, { params });
// 首页：获取Banner
const getHomeBanner = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/banner/recommend`);
// 首页：行业推荐
const getHomeIndustry = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/industryClass/recommend`);
// 首页：能力推荐
const getHomeService = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/serviceGroup/recommend`);

// 旧接口格式
// const getTotalBill = (params: any): AxiosPromise =>
//   fetch.get(`/v1/bill-service/summary/total/${params}`);

// 新接口格式
const getTotalBill = (id: any, month: any): AxiosPromise =>
  fetch.get(`/v1/bill-service/summary/total/${id}/${month}`);

const getUserBill = (userId: number, params: any): AxiosPromise =>
  fetch.get(`/v1/bill-service/summary/user/${userId}`, { params });

const backendPage = (params: number): AxiosPromise =>
  fetch.get(`/v1/system-manager/redirect/${params}`);

// 我的工单: 查询工单列表
const getWorkOrder = (params: any): AxiosPromise =>
  fetch.get("/api/v1/application-manager/workOrder", { params });

// 我的工单: 新建工单列表
const getNewWorkOrder = (params: any): AxiosPromise =>
  fetch.post("/api/v1/application-manager/workOrder", params);

// 个人中心-我的应用-获取接入方式
const getUsemethod = (): AxiosPromise =>
  fetch.get(`/v1/token-server/purchase-info/use-method`);
// 个人中心-我的应用-获取创建应用的可选服务
const getUsechoice = (userid: string): AxiosPromise =>
  fetch.get(`/v1/token-server/purchase-info/${userid}/choice`);

// 个人中心-我的应用-获取计费方式
// const getBillingType = (): AxiosPromise =>
//   fetch.get("/v1/token-server/purchase-info/billing-type");
// 个人中心-我的应用-新的获取计费方式
const getBillingType = (): AxiosPromise =>
  fetch.get("/v1/bill-service/summary/statistical-pattern");
// 个人中心-我的应用-获取用户的应用列表
const getUseList = (useId: string, params: any): AxiosPromise =>
  fetch.get(`/v1/token-server/application/user/${useId}`, { params });

// 个人中心-我的应用-创建应用
const createUseList = (params: any): AxiosPromise =>
  fetch.post("/v1/token-server/application", params);

const changeUseList = (appid: string, params: any): AxiosPromise =>
  fetch.put(`/v1/token-server/application/${appid}`, params);
// 个人中心-我的应用-获取应用详情
const getUsedetail = (appid: string): AxiosPromise =>
  fetch.get(`/v1/token-server/application/${appid}`);
// 个人中心-我的应用-获取用户账单列表
const getBillList = (useId: string, params: any): AxiosPromise =>
  fetch.get(`/v1/token-server/purchase-info/user/${useId}`, { params });
// 个人中心-系统概览-获取服务累计
// const getSystemService = (userId: string): AxiosPromise =>
//   fetch.get(`/v1/user-manager/board/${userId}/purchased`);
const getSystemService = (userId: string): AxiosPromise =>
  fetch.get(`/v1/token-server/purchase-info/${userId}/usage-count`);
// 个人中心-系统概览-获取应用累计
const getAppSummary = (userId: string): AxiosPromise =>
  fetch.get(`/v1/user-manager/board/${userId}/summary`);
// 个人中心-系统概览-获取工单数量
const getWorkOrderCount = (userId: string): AxiosPromise =>
  fetch.get(`/api/v1/application-manager/workOrder/${userId}/count`);
// 个人中心-系统概览-获取服务列表
const getServiceSummary = (userId: string): AxiosPromise =>
  fetch.get(`/v1/user-manager/board/${userId}/service`);
// 个人中心-我的应用-获取用户账单列表
const getBillService = (useId: string): AxiosPromise =>
  fetch.get(`/v1/token-server/purchase-info/${useId}/service`);
// 个人中心-数据看板-获取下拉api
const getConditionList = (userid: any): AxiosPromise =>
  fetch.get(`/v1/token-server/purchase-info/${userid}/select-condition`);
// 个人中心-数据看板-获取下拉应用
const getapplication = (userid: any): AxiosPromise =>
  fetch.get(`/v1/token-server/application/${userid}/select-condition`);
// 个人中心-数据看板-获取看板数据
const getSummaryList = (userid: any, params: any): AxiosPromise =>
  fetch.get(`/v1/bill-service/summary/user/${userid}`, { params });
// 个人中心-数据看板-获取echart看板数据
const getChartList = (userid: any, params: any): AxiosPromise =>
  fetch.get(`/v1/bill-service/summary/${userid}/tendency-chart`, { params });
// 服务：上传文件
const uploadFilePort = (param: any): AxiosPromise =>
  fetch.post("/v1/token-server/application/import/offline", param, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });
// 是否开通对话流
const isPurchase = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user/isPurchase", params);
// 获取用户id
const getUserId = (params: any): AxiosPromise =>
  fetch.get(`/v1/user-manager/user`, { params });
export default {
  userLogin,
  userLogout,
  register,
  registerFirstStep,
  userRegister,
  getVerify,
  getUserInfo,
  getApiNavMenu,
  getIndustryNavMenu,
  getIndustryDetail,
  getIndustryDownload,
  getApplicationDetail,
  changePwd,
  sendMail,
  updateUserInfo,
  getAuthList,
  getOrderList,
  getTotalBill,
  backendPage,
  getUserBill,
  postConsult,
  getHomeBanner,
  getHomeIndustry,
  getHomeService,
  getWorkOrder,
  getNewWorkOrder,
  getUsemethod,
  getBillingType,
  getUseList,
  createUseList,
  changeUseList,
  getUsedetail,
  getUsechoice,
  getBillList,
  getSystemService,
  getAppSummary,
  getServiceSummary,
  getWorkOrderCount,
  getBillService,
  getConditionList,
  getapplication,
  getSummaryList,
  uploadFilePort,
  getChartList,
  isPurchase,
  getUserId,
  Loginnoverify
};
