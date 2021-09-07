import API from "@/api/apis/math";

class MathService {
  public static getMathService(): MathService {
    if (!MathService.instance) {
      MathService.instance = new MathService();
    }
    return MathService.instance;
  }

  private static instance: MathService;

  public async mathPort(url: string, params: any, service: any) {
    try {
      const response = await API.mathPort(url, params, service);
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

export default MathService;
