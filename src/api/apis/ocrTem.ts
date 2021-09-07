import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";

// 查询模板的列表
const getTemplateList = (params: any): AxiosPromise =>
  fetch.get("/v1/template", { params });
// 查询单个模板
const getTemplateItem = (id: any): AxiosPromise =>
  fetch.get(`/v1/template/${id}`);
// 上传模板的图片
const uploadTemImage = (params: any): AxiosPromise =>
  fetch.post("/v1/template", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart",
      service: encodeURIComponent("OCR自定义模板1")
    }
  });

// 删除单个模板
const delTemplateItem = (id: any): AxiosPromise =>
  fetch.delete(`/v1/template/${id}`);

// 试一试
const trialUploadImage = (params: any): AxiosPromise =>
  fetch.post("/v1/template/test", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart",
      service: encodeURIComponent("OCR自定义模板1")
    }
  });

// 发布
const releaseTemItem = (params: any): AxiosPromise =>
  fetch.patch("/v1/template", params);

// 更新模板字段
const changeTemItem = (params: any): AxiosPromise =>
  fetch.put("/v1/template", params, {
    headers: {
      service: encodeURIComponent("OCR自定义模板1")
    }
  });

// 查询所有字段（编辑模板的下拉框）
const getFieldDefault = (): AxiosPromise => fetch.get("/v1/field/default");

// 框选参照字段或参考字段
const getOcrResult = (params: any): AxiosPromise =>
  fetch.post("/v1/ocr/test", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });
//字段管理模块！！！！！！！！！
// 查询字段的列表
const getUserFieldList = (): AxiosPromise => fetch.get("/v1/field");
// 删除字段
const deleteUserFieldList = (id: any): AxiosPromise =>
  fetch.delete(`/v1/field/${id}`);
// 新增字段
const addUserFieldList = (params: any): AxiosPromise =>
  fetch.post("/v1/field", params);
// 更新修改字段
const updateUserFieldList = (params: any): AxiosPromise =>
  fetch.put("/v1/field", params);
// 分类器管理
// 查询列表
const getclassifierdList = (): AxiosPromise => fetch.get("/v1/classifier");
// 穿就按分类器
const createdclassifierd = (params: any): AxiosPromise =>
  fetch.post("/v1/classifier", params);
// 查询单个列表
const getclassifierd = (id: any): AxiosPromise =>
  fetch.get(`/v1/classifier/${id}`);
// 查询预置模板
const getextClass = (id: any): AxiosPromise =>
  fetch.get(`/v1/classifier/extClass/${id}`);
// 查询自定义模板
const gettemplateClass = (id: any): AxiosPromise =>
  fetch.get(`/v1/classifier/template/${id}`);
// 删除分类器
const deltemplateClass = (id: any): AxiosPromise =>
  fetch.delete(`/v1/classifier/${id}`);
// 分类器试一试
const testclassifierd = (params: any): AxiosPromise =>
  fetch.post("/v1/classifier/test", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });
// 添加模板
const putClassList = (params: any): AxiosPromise =>
  fetch.put("/v1/classifier", params);
// 删除自定义模板或者默认模板
const deltemplateSign = (id: any, params: any): AxiosPromise =>
  fetch.delete(`/v1/classifier/subList/${id}`, { params });
// 分类器试一试
export default {
  getTemplateList,
  getTemplateItem,
  uploadTemImage,
  delTemplateItem,
  trialUploadImage,
  releaseTemItem,
  changeTemItem,
  getFieldDefault,
  getOcrResult,
  // 字段管理
  getUserFieldList,
  deleteUserFieldList,
  addUserFieldList,
  updateUserFieldList,
  // 分类器
  getclassifierdList,
  createdclassifierd,
  getclassifierd,
  getextClass,
  gettemplateClass,
  deltemplateClass,
  testclassifierd,
  putClassList,
  deltemplateSign
};
