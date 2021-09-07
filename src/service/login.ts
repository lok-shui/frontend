import API from "@/api/apis";
import store from "@/store";
import router from "@/router";
import cache from "@/utils/cache";
import { cloneDeep } from "lodash";

class LoginService {
  public static getLoginService(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  private static instance: LoginService;

  public async login(user: any) {
    try {
      const response = await API.userLogin(user);
      if (response.data) {
        const res: any = response.data;
        console.log(res);
        if (res.code === 0) {
          const data = res.data;
          if (data && data.id) {
            // cache.localClear();
            store.commit("clearUser");
            store.commit("updateUser", { ...data });
            // store.commit("getNavData", { ...data });
            cache.localSet("ai-front-id", data.id);
            cache.localSet("username", data.username);
            cache.localSet("pswRank", data.pswRank);
            return data;
          } else {
            throw new Error(response.data.error);
          }
        } else {
          return null;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async Loginnoverify(user: any) {
    try {
      const response = await API.Loginnoverify(user);
      if (response.data) {
        const res: any = response.data;
        console.log(res);
        if (res.code === 0) {
          const data = res.data;
          if (data && data.id) {
            // cache.localClear();
            // store.commit("clearUser");
            store.commit("updateUser", { ...data });
            // store.commit("getNavData", { ...data });
            cache.localSet("ai-front-id", data.id);
            cache.localSet("username", data.username);
            cache.localSet("pswRank", data.pswRank);
            return data;
          } else {
            throw new Error(response.data.error);
          }
        } else {
          return null;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public logout() {
    cache.localClear();
    store.commit("clearUser");

    // 转到后台页面的接口，现在没用了
    // this.redirectBackendLogoutPage();
    // router.push("/login");
    // 有首页了，再改回来 router.push("/login");

    // 在谷歌浏览器中，如果没有登录，点击二级菜单都会重定向到facePage/1，先注释了
    // router.push("/main/document/ApiPower/facePage/1");
  }

  public loginByDmid() {
    const dmid = location.href.substr(location.href.lastIndexOf("#") + 1);
    if (dmid) {
      cache.localSet("dmid", dmid);
      router.push("/main/index");
      console.log("dmid:", dmid, cache.localGet("dmid"));
    } else {
      router.push("/login");
    }
  }

  public async redirectBackendPage() {
    window.location.href = await this._backendPage(1);
  }

  public async redirectBackendLogoutPage() {
    window.location.href = await this._backendPage(3);
  }

  private async _backendPage(type: number) {
    const response = await API.backendPage(type);
    return `${response.data.data}`;
  }

  public async regist(params: any) {
    try {
      const response = await API.register(params);
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

  public async registerFirstStep(params: any) {
    try {
      const response = await API.registerFirstStep(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async userRegister(params: any) {
    try {
      const response = await API.userRegister(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getVerify() {
    try {
      const response = await API.getVerify();
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

  public async getUserInfo(params: string) {
    try {
      const response = await API.getUserInfo(params);
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

  public async getApiNavMenu() {
    try {
      const response = await API.getApiNavMenu();

      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          if (res) {
            store.commit("getNavData", res);
            cache.localSet("navData", cloneDeep(res));
            return data;
          } else {
            throw new Error(response.data.error);
          }
        } else {
          return null;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getIndustryNavMenu() {
    try {
      const response = await API.getIndustryNavMenu();

      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          if (res) {
            return data;
          } else {
            throw new Error(response.data.error);
          }
        } else {
          return null;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getIndustryDetail(name: string) {
    try {
      const response = await API.getIndustryDetail(name);

      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          if (res) {
            return data;
          } else {
            throw new Error(response.data.error);
          }
        } else {
          return null;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getApplicationDetail(name: string) {
    try {
      const response = await API.getApplicationDetail(name);

      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          if (res) {
            return data;
          } else {
            throw new Error(response.data.error);
          }
        } else {
          return null;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getHomeBanner() {
    try {
      const response = await API.getHomeBanner();
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

  public async getHomeIndustry() {
    try {
      const response = await API.getHomeIndustry();
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

  public async getHomeService() {
    try {
      const response = await API.getHomeService();
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

export default LoginService;
