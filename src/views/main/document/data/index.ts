const code1 = `{
  "code":0, //使用系统异常自定义状态码，非0的状态码
  "data":any    //任意类型：数组、基础类型、字符串、对象
}`;

const code2 = `{
  "code":500,   //使用系统异常自定义状态码，非0的状态码
  "error":"错误信息描述"
}`;

const code3 = `{
  "code":0,   //使用系统异常自定义状态码，非0的状态码
  "data":{
  "totalPages":22,    //总页数
  "page":1,                   //当前页
  "per_page": 10,     //每页记录数
  "count": 220,           //总记录数
  "sortBy": null,     //排序字段
  "order":null,           //升序(true)/逆序(false)
  "data":[
    {
      "id": 1,
      "username": "admin",
      "userId": 1,
      "clientId": "999808858245857280",
      "resourceIds": "护眼模式",
      "clientSecret": "872I6D6G",
      "purchaseTime": 1585379151608
    }
  ]
}`;

const doc1: any = {
  title: "接入指南",
  content: [
    {
      title: "API网关计费模式000",
      key: "1",
      children: [
        {
          key: "1.1",
          type: "text",
          text: "1）按量计费：API调用即时扣费，使用多少，扣费多少"
        },
        {
          key: "1.2",
          type: "text",
          text: "2）按时计费：付费时段无限量使用，高量低价享用API服务"
        }
      ]
    },
    {
      title: "免费额度",
      key: "2",
      children: [
        {
          key: "2.1",
          type: "text",
          text: "开通服务后，免费试用100次或者试用1个月"
        }
      ]
    },
    {
      title: "计费项说明",
      key: "3",
      children: [
        {
          key: "3.1",
          type: "text",
          text: "API 网关的计费项包括：调用次数费用和流量费用。费用组成如下："
        },
        {
          key: "3.2",
          type: "table",
          tableColumns: [
            { title: "column1", dataIndex: "a" },
            { title: "column2", dataIndex: "b" }
          ],
          tableData: [
            { a: "11", b: "22", index: 1 },
            { a: "11", b: "22", index: 2 }
          ]
        }
      ]
    },
    {
      title: "SDK收费",
      key: "4",
      children: [
        {
          key: "4.1",
          type: "text",
          text:
            "SDK是指在设备上进行人工智能运算的代码包。接入工具是指方便开发者进行 API 调用的代码包。您如果使用 API，可以按照 API 接口的技术规范自己完成 API 调用。所以使用 API 不依赖于接入工具或SDK。"
        },
        { key: "4.2", type: "text", text: "SDK价格及收费:" },
        {
          key: "4.3",
          type: "table",
          tableColumns: [
            { title: "column1", dataIndex: "a" },
            { title: "column2", dataIndex: "b" }
          ],
          tableData: [
            { a: "11", b: "22", index: 1 },
            { a: "11", b: "22", index: 2 }
          ]
        }
      ]
    },
    {
      title: "欠费说明",
      key: "5",
      children: [
        {
          key: "5.1",
          type: "text",
          text:
            "当您的账户发生欠费时，欠费XX小时内，您可以继续使用 API 网关服务。"
        },
        {
          key: "5.2",
          type: "text",
          text:
            "若XX小时后仍未续费，您的 API 将被停止调用，我们将以短信的方式通知到AI赋能平台账户的创建者提醒续费。"
        },
        {
          key: "5.3",
          type: "text",
          text:
            "服务被暂停后180天内，您成功充值后，服务可自动开启，并继续使用；服务被暂停超过180天，API 网关将有权清理您的 API 配置信息，您的数据将会被销毁。"
        }
      ]
    }
  ]
};

const doc2: any = {
  title: "欢迎使用AI赋能开放平台。",
  content: [
    {
      title: "这里会指导您顺利完成API与SDK的接入。"
    }
  ]
};

const doc3: any = {
  title: "API调用规则",
  content: [
    {
      title: "API调用——原理",
      key: "1",
      children: [
        {
          key: "1.1",
          type: "text",
          text:
            "AI赋能平台 API是HTTP API。常用的编程语言都能发起HTTP请求（通过第三方库或自带API），使用者向我们的服务器发起HTTP请求，并加上合适的参数，服务器将会对请求进行处理，得到结果将会返回给使用者。"
        }
      ]
    },
    {
      title: "API调用——参数",
      key: "2",
      children: [
        {
          key: "1.1",
          type: "text",
          text:
            "调用每个API需要根据需求传不同的参数，每个API参数的详细定义请查看 人脸识别 。所有 API 的调用都要使用 POST 请求，用户可以 Query String 的形式将参数写进请求体中，传图片文件参数时则需要在请求体中使用 multipart/form-data 格式来编码。"
        }
      ]
    },
    {
      title: "API调用——鉴权",
      key: "3",
      children: [
        {
          key: "1.1",
          type: "text",
          text:
            "帐号下每创建一个应用就会生成一组对应的 api_key 和 api_secret，用以识别用户是否有权限调用 API，所有的API调用必须提供对应的一组 api_key 和 api_secret 参数。"
        }
      ]
    },
    {
      title: "API调用——提示",
      key: "4",
      children: [
        {
          key: "1.1",
          type: "text",
          text:
            "为了避免因网络问题而造成的阻塞，建议将 API 调用放进异步线程里执行。"
        }
      ]
    }
  ]
};

const doc4: any = {
  title: "API 规范",
  content: [
    {
      title: "公用基础规范",
      key: "1",
      children: [
        {
          key: "1.1",
          type: "subTitle",
          text: "正常返回"
        },
        {
          key: "1.2",
          type: "code",
          code: code1
        },
        {
          key: "1.3",
          type: "subTitle",
          text: "错误/异常返回"
        },
        {
          key: "1.4",
          type: "code",
          code: code2
        },
        {
          key: "1.5",
          type: "subTitle",
          text: "分页请求参数"
        },
        {
          key: "1.6",
          type: "table",
          tableColumns: [
            { title: "参数名", dataIndex: "a" },
            { title: "必选", dataIndex: "b" },
            { title: "类型", dataIndex: "c" },
            { title: "说明", dataIndex: "d" }
          ],
          tableData: [
            { a: "page", b: "是", c: "int", d: "获取每页数据", index: 1 },
            { a: "per_page", b: "是", c: "int", d: "每页记录数", index: 2 },
            {
              a: "sortBy",
              b: "否",
              c: "string",
              d: "排序字段 ，多个用,分隔",
              index: 3
            },
            {
              a: "order",
              b: "否",
              c: "string",
              d: "可选值：asc/desc  升序/逆序",
              index: 4
            }
          ]
        }
      ]
    },
    {
      title: "分页返回",
      key: "2",
      children: [
        {
          key: "2.1",
          type: "code",
          code: code3
        }
      ]
    }
  ]
};

export default [doc1, doc2, doc3, doc4];
