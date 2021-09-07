import { AxiosPromise } from "axios";
import mathFetch from "@/api/fetch/mathIndex";

// 算法接口
const mathPort = (url: string, params: string, service: any): AxiosPromise =>
  mathFetch.post(`${url}`, params, {
    headers: {
      service: service
    }
  });

export default {
  mathPort
};
