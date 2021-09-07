import API from "@/api/apis/ocrTem";
import cache from "@/utils/cache";

class OCRService {
  public static getOCRService(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }
  private static instance: OCRService;

  public async getTemplateList(params: any) {
    try {
      const response = await API.getTemplateList(params);
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
  public async getTemplateItem(id: any) {
    try {
      const response = await API.getTemplateItem(id);
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

  public async uploadImage(params: any) {
    try {
      const response = await API.uploadTemImage(params);
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

  public async trialUploadImage(params: any) {
    try {
      const response = await API.trialUploadImage(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      cache.localSet("trialErrorMessage", err.response.data.error);
      cache.localSet("trialErrorCode", err.response.status);
      return Promise.reject(err);
    }
  }

  public async delTemplateItem(id: any) {
    try {
      const response = await API.delTemplateItem(id);
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

  public async releaseTemItem(params: any) {
    try {
      const response = await API.releaseTemItem(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      cache.localSet("releaseErrorMessage", err.response.data.error);
      cache.localSet("releaseErrorCode", err.response.status);
      return Promise.reject(err);
    }
  }

  public async changeTemItem(params: any) {
    try {
      const response = await API.changeTemItem(params);
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

  public async getFieldDefault() {
    try {
      const response = await API.getFieldDefault();
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

  public async getOcrResult(params: any) {
    try {
      const response = await API.getOcrResult(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      cache.localSet("identifyError", err.response.status);
      return Promise.reject(err);
    }
  }
  // 字段管理
  public async getUserFieldList() {
    try {
      const response = await API.getUserFieldList();
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
  public async deleteUserFieldList(id: any) {
    try {
      const response = await API.deleteUserFieldList(id);
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
  public async addUserFieldList(params: any) {
    try {
      const response = await API.addUserFieldList(params);
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
  public async updateUserFieldList(params: any) {
    try {
      const response = await API.updateUserFieldList(params);
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
  // 分类器
  public async getclassifierdList() {
    try {
      const response = await API.getclassifierdList();
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
  public async createdclassifierd(params: any) {
    try {
      const response = await API.createdclassifierd(params);
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
  public async getclassifierd(params: any) {
    try {
      const response = await API.getclassifierd(params);
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
  public async getextClass(id: any) {
    try {
      const response = await API.getextClass(id);
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
  public async gettemplateClass(id: any) {
    try {
      const response = await API.gettemplateClass(id);
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
  public async deltemplateClass(id: any) {
    try {
      const response = await API.deltemplateClass(id);
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
  public async testclassifierd(params: any) {
    try {
      const response = await API.testclassifierd(params);
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
  public async putClassList(params: any) {
    try {
      const response = await API.putClassList(params);
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
  public async deltemplateSign(id: any, params: any) {
    try {
      const response = await API.deltemplateSign(id, params);
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

export default OCRService;
