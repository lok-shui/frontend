import API from "@/api/apis/order";

class userOrder {
  public static getOrder(): userOrder {
    if (!userOrder.instance) {
      userOrder.instance = new userOrder();
    }
    return userOrder.instance;
  }
  private static instance: userOrder;

  public async putOrderDetails(params: any) {
    try {
      const response = await API.putOrderDetails(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getOrderDetails(params: any) {
    try {
      const response = await API.getOrderDetails(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default userOrder;
