import axios, { AxiosInstance } from "axios";
import { message as Toast } from "ant-design-vue";
import Vue from "vue";

import cache from "@/utils/cache";
import mathConfig from "@/api/fetch/mathConfig";

// eslint-disable-next-line
import router from '@/router'
// import interceptors from '@/api/fetch/interceptors';

const mathFetch: AxiosInstance = axios.create({
  ...mathConfig
});

mathFetch.interceptors.request.use(
  async mathconfig => {
    try {
      // 算法接口的token值(也就是dmid)
      const dmid = "b28847e4-6c1d-49d1-8172-05d3d1c83154";
      mathconfig.headers.dmid = dmid;
    } catch (err) {
      console.log(err);
      // 如果刷新失败，应当终止当前请求
      return Promise.reject(err);
    }
    return mathconfig;
  },
  error => Promise.reject(error)
);

mathFetch.interceptors.response.use(
  async response => {
    console.log("拦截器返回的response", response);

    if (response.data && response.data.code !== 0) {
      Toast.destroy();
      const error =
        response.data.error || response.data.data || "请求出错，请检查重试";
      Toast.error(error);
      return Promise.reject({
        error,
        code: response.data.code
      });
    }
    return response;
  },

  async error => {
    Toast.destroy();
    let msg;
    console.log("拦截器返回的error", error);
    if (error.response) {
      if (error.response.status >= 500) {
        if (error.response.status == 401) {
          msg = error.response.data.message;
        } else {
          msg = "服务器好像开小差了，请稍后重试";
        }
      } else if (error.response.status === 403) {
        cache.localClear();
        if (error.response.data && error.response.data.error) {
          msg = error.response.data.error;
        }
        Toast.error(msg, 5);
        return Promise.reject(new Error(msg));
      } else if (error.response.status >= 400) {
        if (error.response.status == 420) {
          msg = error.response.data.message;
        }
      }
    } else if (error.code === "ECONNABORTED") {
      msg = "网络出了点问题，请稍后重试";
    } else {
      msg = "网络出了点问题，请稍后重试";
    }
    Toast.error(msg || "服务器好像开小差了", 5);
    return Promise.reject(error);
  }
);

export default mathFetch;
