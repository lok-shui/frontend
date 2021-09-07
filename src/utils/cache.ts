const formValueObj = (value: any) => ({ value });
const getRealVal = (obj: any) => obj && obj.value;

const cache = {
  sessionGet(key: any) {
    try {
      return getRealVal(
        JSON.parse(window.sessionStorage.getItem(key) as string)
      );
    } catch (error) {
      window.localStorage.clear();
      throw new Error(error);
    }
  }, // 返回true/false，用于校验当前用户是否登录
  sessionGetValue(key: any) {
    try {
      return JSON.parse(window.sessionStorage.getItem(key) as string).value;
    } catch (error) {
      window.localStorage.clear();
      throw new Error(error);
    }
  }, // 返回当前登录的用户名
  sessionGetOnce(key: any) {
    const data = getRealVal(
      JSON.parse(window.sessionStorage.getItem(key) as string)
    );
    window.sessionStorage.removeItem(key);
    return data;
  },
  sessionSet(key: any, value: any) {
    window.sessionStorage.setItem(key, JSON.stringify(formValueObj(value)));
  },
  sessionRemove(key: any) {
    window.sessionStorage.removeItem(key);
  },
  sessionClear() {
    window.sessionStorage.clear();
  },
  localGet(key: any) {
    try {
      return getRealVal(JSON.parse(window.localStorage.getItem(key) as string));
    } catch (error) {
      window.localStorage.clear();
      throw new Error(error);
    }
  },
  localSet(key: any, value: any) {
    window.localStorage.setItem(key, JSON.stringify(formValueObj(value)));
  },
  localRemove(key: any) {
    window.localStorage.removeItem(key);
  },
  localClear() {
    window.localStorage.clear();
  }
};

export default cache;
