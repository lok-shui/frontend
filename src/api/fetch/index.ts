import axios, { AxiosInstance } from "axios";
import { message as Toast } from "ant-design-vue";
import Vue from "vue";
// import apis from '../apis/index'
// import EventEmitter from "eventemitter3";
// import store from "@/store";

import cache from "@/utils/cache";
import axiosConfig from "@/api/fetch/config";
// eslint-disable-next-line
import router from '@/router'
// import interceptors from '@/api/fetch/interceptors';

const fetch: AxiosInstance = axios.create({
  ...axiosConfig
});

fetch.interceptors.request.use(
  async config => {
    try {
      // 前台服务校验方式
      const id = cache.localGet("ai-front-id");
      const token = cache.localGet("ai-front-token");
      if (id) {
        config.headers.id = id;
        config.headers.token = token;
      }

      // 后台服务校验方式
      const dmid = cache.localGet("dmid");
      if (dmid) {
        config.headers.dmid = dmid;
      }
    } catch (err) {
      console.log(err);
      // 如果刷新失败，应当终止当前请求
      return Promise.reject(err);
    }
    return config;
  },
  error => Promise.reject(error)
); // Do something with request error

// respone拦截器
fetch.interceptors.response.use(
  async response => {
    // let test = await apis.cumTokenRefresh();
    // console.log(test)
    // 200 成功的返回不做处理
    // console.log(response);
    if (response.headers && response.headers.token) {
      cache.localSet("ai-front-token", response.headers.token);
    }

    if (response.data && response.data.code !== 0) {
      Toast.destroy();
      const error =
        response.data.error || response.data.data || "请求出错，请检查重试";
      Toast.error(error);
      if (
        response.data.code === 420 ||
        error.indexOf("session过期") !== -1 ||
        error.indexOf(" Token has expired ") !== -1
      ) {
        cache.localClear();
        router.push("/login");
      }
      return Promise.reject({
        error,
        code: response.data.code
      });
    }
    return response;
    // const res = response.data
    // // console.log(response.data || response)
    // if (!res || res.code < 0) {
    //   Toast.error(res.msg || res, 5)
    //   return Promise.reject(res)
    // }
    // return res
  },
  async error => {
    // 禁用重传
    // // console.error(error, Date.now()) // for debug
    // const needRetry = error.code === 'ECONNABORTED' || (error.response && (error.response.status === 401 || error.response.status === 500))
    // // @ts-ignore
    // if (((error.config && error.config.retryCount === fetch.retry) || !needRetry) && !error.config.noToast) {
    Toast.destroy();
    let msg;
    console.log(error.config);
    console.log(error.params);
    console.log(error.query);
    if (error.response) {
      if (error.response.status >= 500) {
        // msg = "服务器好像开小差了，请稍后重试";
        // 登录后copy地址到不同浏览器打开,重新登录
        if (error.response.status == 401) {
          msg = error.response.data.message;
          router.push("/login");
        }
      } else if (error.response.status === 403) {
        console.log(
          error.response.status + " !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );
        cache.localClear();
        if (error.response.data && error.response.data.error) {
          msg = error.response.data.error;
        } else {
          msg = "账号过期，请重新登录";
        }
        // 这里直接跳转，不返回rejected
        console.log("强制跳转到login");
        //@ts-ignore
        setTimeout(
          () =>
            Vue.nextTick(() => setTimeout(() => router.push("/login"), 566)),
          566
        );
        Toast.error(msg, 5);
        // window.location.reload()
        // return Promise.resolve({ data: { res: 'no', error: '账号过期，请重新登录' } })
        return Promise.reject(new Error(msg));
      } else if (error.response.status === 401) {
        router.push("/login");
        // try {
        //   return await handleError401(error);
        // } catch (err) {
        //   return handleRefreshTokenFailed();
        // }
      } else if (error.response.status === 400) {
        msg = error.response.data.error;
      } else if (error.response.status === 406) {
        // 406 TOKEN 过期，按照401的方式重新刷新即可
        // try {
        //   return await handleError401(error);
        // } catch (err) {
        //   return handleRefreshTokenFailed();
        // }
      } else if (error.response.status >= 400) {
        // msg = "请求出错，请检查重试!";
        if (error.response.status == 420) {
          // msg = "账号过期，请重新登录!";
          msg = error.response.data.message;
          router.push("/login");
          cache.localClear();
        }
      }
      // msg = error.response.data && error.response.data.msg
    } else if (error.code === "ECONNABORTED") {
      msg = "网络出了点问题，请稍后重试";
    } else {
      msg = "网络出了点问题，请稍后重试";
    }
    Toast.error(msg || error.response.data.error, 5);
    return Promise.reject(error);
  }
);

export default fetch;
