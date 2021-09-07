import API from "@/api/apis";

class DocService {
  public static getDocService(): DocService {
    if (!DocService.instance) {
      DocService.instance = new DocService();
    }
    return DocService.instance;
  }

  private static instance: DocService;

  public async getInterfaceList() {
    try {
      const response = await API.getInterfaceList();
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

  public async getInterfaceDetail(params: any) {
    try {
      const response = await API.getInterfaceDetail(params);
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

  public async getWorkApiList() {
    try {
      const response = await API.getWorkApiList();
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
  public async getEnglishAudio(params: any) {
    try {
      const response = await API.getEnglishAudio(params);
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

  public async getAPIPower(params: any) {
    try {
      const response = await API.getAPIPower(params);
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

export default DocService;
