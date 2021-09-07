/**
 * axios请求配置，具体见: https://github.com/axios/axios
 */
const mathConfig: object = {
  timeout: 180000, // 超时时间3分钟
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "-1",
    language: "en"
  },
  withCredentials: true
};

export default mathConfig;
