import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";

// API文档页面的接口列表
const getInterfaceList = (): AxiosPromise =>
  fetch.get("/v1/service-manager/service/showed-list");
// API文档页面的接口
const getInterfaceDetail = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/interface/${params}`);
// 工单页面用的api接口
const getWorkApiList = (): AxiosPromise =>
  fetch.get("/v1/service-manager/service/useful-list");

const getEnglishAudio = (params: string): AxiosPromise =>
  fetch.post(`/model.ai/tts`, params);

const getAPIPower = (params: string): AxiosPromise =>
  fetch.post(`/v1/service-manager/service/runnable-list`, params);

export default {
  getInterfaceList,
  getInterfaceDetail,
  getEnglishAudio,
  getAPIPower,
  getWorkApiList
};
