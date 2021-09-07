import cache from "@/utils/cache";
import LoginService from "@/service/login";
const loginService = LoginService.getLoginService();

const state = {
  id: cache.localGet("ai-front-id"),
  username: cache.localGet("username"),
  pswRank: cache.localGet("pswRank"),
  company: cache.localGet("company"),
  email: cache.localGet("email"),
  phone: cache.localGet("phone"),
  realName: cache.localGet("realName"),
  data: cache.localGet("navData"),
  showDrawer: false
};
const nav = {
  data: cache.localGet("navData")
};

const getters = {};

const actions = {
  async getUserInfo({ commit }: any) {
    const id = cache.localGet("ai-front-id");
    const response = await loginService.getUserInfo(id);
    console.log("用户信息,", response);
    commit("updateUser", { ...response });
  },
  async getApiNavMenu({ commit }: any) {
    const response = await loginService.getApiNavMenu();
    console.log("导航菜单数据,", response);
    // commit("getNavData", { ...response });
  }
};

const mutations = {
  updateUser(state: any, theUser: any) {
    for (const i of Object.keys(theUser)) {
      state[i] = theUser[i];
    }
  },
  getNavData(nav: any, theUser: any) {
    for (const i of Object.keys(theUser)) {
      nav[i] = theUser[i];
    }
  },
  clearUser(state: any) {
    for (const i of Object.keys(state)) {
      if (typeof state[i] === "string") {
        state[i] = "";
      } else if (typeof state[i] === "number") {
        state[i] = 0;
      } else if (state[i] instanceof Array) {
        state[i] = [];
      } else {
        state[i] = null;
      }
    }
  },
  changeshowDrawer(state: any, isshow: boolean) {
    state.showDrawer = isshow;
  }
};

export default {
  state,
  nav,
  getters,
  actions,
  mutations
};
