import Vue from "vue";
import monent from "moment";

Vue.filter("formatDate", (val: string | number, formatStr: string) => {
  return val ? monent(val).format(formatStr) : "--";
});
