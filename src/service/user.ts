import API from "@/api/apis";

class UserService {
  public static getUserService(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  // 合作咨询
  public async postConsult(params: any) {
    try {
      const response = await API.postConsult(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  private static instance: UserService;

  public async changePwd(params: any) {
    try {
      const response = await API.changePwd(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async sendMail(params: any) {
    try {
      const response = await API.sendMail(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async updateUserInfo(id: number, params: any) {
    try {
      const response = await API.updateUserInfo(id, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getAuthList(id: number, params: any) {
    try {
      const response = await API.getAuthList(id, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getOrderList(userId: string, params: any) {
    try {
      const response = await API.getOrderList(userId, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getUserBill(userId: number, params: any) {
    try {
      const response = await API.getUserBill(userId, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getTotalBill(id: any, month: any) {
    try {
      const response = await API.getTotalBill(id, month);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getIndustryDownload(id: number) {
    try {
      const response = await API.getIndustryDownload(id);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getUsemethod() {
    try {
      const response = await API.getUsemethod();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getBillingType() {
    try {
      const response = await API.getBillingType();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getUseLists(useId: string, params: any) {
    try {
      const response = await API.getUseList(useId, params);
      console.log("response", response.data);

      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          return res;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async createUseList(params: any) {
    try {
      const response = await API.createUseList(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async changeUseList(appid: string, params: any) {
    try {
      const response = await API.changeUseList(appid, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getUsedetail(appid: string) {
    try {
      const response = await API.getUsedetail(appid);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getUsechoic(userid: string) {
    try {
      const response = await API.getUsechoice(userid);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getBillLists(useId: string, params: any) {
    try {
      const response = await API.getBillList(useId, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getWorkOrder(params: any) {
    try {
      const response = await API.getWorkOrder(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getNewWorkOrder(params: any) {
    try {
      const response = await API.getNewWorkOrder(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getSystemService(userId: string) {
    try {
      const response = await API.getSystemService(userId);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getAppSummary(userId: string) {
    try {
      const response = await API.getAppSummary(userId);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getServiceSummary(userId: string) {
    try {
      const response = await API.getServiceSummary(userId);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getWorkOrderCount(userId: string) {
    try {
      const response = await API.getWorkOrderCount(userId);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getBillService(userId: string) {
    try {
      const response = await API.getBillService(userId);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getConditionList(userid: any) {
    try {
      const response = await API.getConditionList(userid);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getapplication(userid: any) {
    try {
      const response = await API.getapplication(userid);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getSummaryList(userid: any, params: any) {
    try {
      const response = await API.getSummaryList(userid, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async uploadFilePort(params: any) {
    try {
      const response = await API.uploadFilePort(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getChartList(userid: any, params: any) {
    try {
      const response = await API.getChartList(userid, params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async isPurchase(params: any) {
    try {
      const response = await API.isPurchase(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getUserId(params: any) {
    try {
      const response = await API.getUserId(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default UserService;
