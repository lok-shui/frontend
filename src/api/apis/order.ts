import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";

const putOrderDetails = (params: any): AxiosPromise =>
  fetch.put("/v1/order-manager/purchaseOrderDetail", params);
const getOrderDetails = (params: any): AxiosPromise =>
  fetch.patch("/v1/order-manager/purchaseOrderDetail", params);
export default {
  getOrderDetails,
  putOrderDetails
};
