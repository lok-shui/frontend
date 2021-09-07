<template>
  <div class="contain">
    <div class="title">restful规范</div>
    <div class="content-item">
      <div class="content-title">一、协议</div>
      <div class="item">
        API与用户的通信协议，总是使用<a
          href="http://www.ruanyifeng.com/blog/2014/02/ssl_tls.html"
          >HTTPs协议</a
        >
      </div>
      <div class="content-title">二、域名</div>
      <div class="item">应该尽量将API部署在专用域名之下</div>
      <pre class="code" v-html="highlightCode('https:``//xxx.dm-ai.cn/api/')" />
      <div class="content-title">三、版本（Versioning）</div>
      <div class="item">应该将API的版本号放入URL。</div>
      <pre class="code" v-html="highlightCode('https://xxx.dm-ai.cn/api/v1')" />
      <div class="content-title">四、路径（Endpoint）</div>
      <div class="item">路径又称"终点"（endpoint），表示API的具体网址。</div>
      <div class="item">
        在RESTful架构中，每个网址代表一种服务或资源（resource）。
      </div>
      <div class="item">路径中：</div>
      <ul>
        <li>资源应当为复数形式，避免歧义；</li>
        <li>应避免使用动词；</li>
        <li>应避免使用下划线、大写字母（用‘-’来连接单词）；</li>
        <li>避免在路径的结尾使用‘/’</li>
      </ul>
      <pre
        class="code"
        v-html="
          highlightCode(
            'https://xxx.dm-ai.cn/api/v1/服务名/服务内容https://xxx.dm-ai.cn/api/v1/faces/embedding  #人脸特征抽取\n' +
              'https://xxx.dm-ai.cn/api/v1/ocr/print   #ocr印刷体识别'
          )
        "
      />
      <div class="content-title">五、请求方法</div>
      <div class="item">
        常用的HTTP动词有下面五个（括号里是对应的SQL命令）。
      </div>
      <pre
        class="code"
        v-html="
          highlightCode(
            'GET（SELECT）：从服务器取出资源（一项或多项）。POST（CREATE）：在服务器新建一个资源。\n' +
              'PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。\n' +
              'PATCH（UPDATE）：在服务器更新资源（客户端提供改变的部分属性）。\n' +
              'DELETE（DELETE）：从服务器删除资源。'
          )
        "
      />
      <div class="item">两个不常用的HTTP动词。</div>
      <pre
        class="code"
        v-html="
          highlightCode(
            'HEAD：获取资源的元数据。\n' +
              'OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。'
          )
        "
      />

      <div class="content-title">六、过滤信息（Filtering）</div>
      <div class="item">
        如果记录数量很多，服务器不可能都将它们返回给用户。API应该提供参数，过滤返回结果。
      </div>
      <div class="item">下面是一些常见的参数。</div>
      <pre
        class="code"
        v-html="
          highlightCode(
            '?limit=10：指定返回记录的数量\n' +
              '?offset=10：指定返回记录的开始位置。\n' +
              '?page=2&per_page=100：指定第几页，以及每页的记录数。\n' +
              '?sortBy=name&order=asc：指定返回结果按照哪个属性排序，多个用“,”隔开，以及排序顺序。\n' +
              '?animal_type_id=1：指定筛选条件'
          )
        "
      />
      <div class="content-title">七、请求体格式</div>
      <div class="item">常见的三种body format:</div>
      <div class="item">1.Content-Type: application/json</div>
      <pre class="code" v-html="highlightCode(contentType)" />
      <div class="item">
        2.Content-Type: application/x-www-form-urlencoded
        (浏览器POST表单用的格式)
      </div>
      <pre
        class="code"
        v-html="
          highlightCode(
            'POST /login HTTP/1.1\n' +
              'Host: example.com\n' +
              'Content-Length: 31\n' +
              'Accept: text/html\n' +
              'Content-Type: application/x-www-form-urlencoded\n' +
              '\n' +
              'username=root&password=Zion0101'
          )
        "
      />
      <div class="item">
        3.Content-Type: multipart/form-data (表单有文件上传时的格式)
      </div>
      <div class="content-title">八、返回数据格式</div>
      <div class="item">常见返回的数据的格式一般用JSON。</div>
      <div class="item">对应返回的内容，常见的做法是：</div>
      <div class="item">路径中：</div>
      <ul>
        <li>
          <ul>
            code：http的status code
            <li>
              如果有自己定义的额外的错误，那么也可以考虑用自己定义的错误码
            </li>
          </ul>
        </li>
        <li>
          <ul>
            data
            <li>
              <ul>
                对应数据的json字符串
                <li>如果是数组，则对应最外层是[]的`list`</li>
                <li>如果是对象，则对应最外层是{}的`dict`</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <ul>
            error
            <li>对应错误状态码的错误信息</li>
          </ul>
        </li>
      </ul>
      <div class="item">成功返回数据示例：</div>
      <pre class="code" v-html="highlightCode(success)" />
      <div class="item">失败返回数据示例：</div>
      <pre class="code" v-html="highlightCode(fail)" />
      <div class="item">失败返回数据示例：</div>
      <pre class="code" v-html="highlightCode(page)" />
      <div class="content-title">九、状态码（Status Codes）</div>
      <div class="item">
        服务器向用户返回的状态码和提示信息，常见的有以下一些（方括号中是该状态码对应的请求方法）。
      </div>
      <pre
        class="code"
        v-html="
          highlightCode(
            '200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。\n' +
              '201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。\n' +
              '202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）\n' +
              '204 NO CONTENT - [DELETE]：用户删除数据成功。\n' +
              '300 Multiple Choices - [*]：请求成功，但结果有多种选择。\n' +
              '301 Moved Permanently - [*]： 请求成功，但是资源被永久转移。\n' +
              '302 Found - [*]： 请求成功，但是资源被临时转移了。\n' +
              '303 See Other - [*]：请求成功，GET来访问新的地址来获取资源。\n' +
              '304 Not Modified - [*]：请求成功，请求的资源并没有被修改过。\n' +
              '305 Use Proxy - [*]：请求成功，请求的资源必须通过代理访问。\n' +
              '400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。\n' +
              '401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。\n' +
              '403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。\n' +
              '404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。\n' +
              '405 Method Not Allowed - [PUT/PATCH]:请求的方法不允许使用(比如服务器只实现了PATCH了局部更新资源，并没有实现PUT来替换资源，而我们使用了PUT)。\n' +
              '406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。\n' +
              '410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。\n' +
              '422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。\n' +
              '500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。\n' +
              '501 Not Implemented - [*]：请求还没有被实现。\n' +
              '502 Bad Gateway - [*]：错误网关。\n' +
              '503 Service Unavailable - [*]：服务暂时不可用。\n' +
              '504 Gateway Timeout - [*]：网关超时.\n' +
              '505 HTTP Version Not Supported - [*]： 请求的 HTTP 版本不支持。'
          )
        "
      />
      <div class="item">
        状态码的完全列表参见<a
          href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html"
          >这里</a
        >
      </div>
      <div class="content-title">自定义状态码:</div>
      <div class="item">
        对于http status code没办法准确传达错误信息的情况，可以通过自定义"code"
        和"message"字段来确定服务状态和错误消息。
      </div>
      <div class="item">
        对于公司所有接口通用的特殊错误，可以通过如下的方式进行定义并逐渐完善形成一套规范，code一般为五位数字，可以从10000开始编排，并且要清晰界定对应code所代表的错误信息，必要时可以加以解释和举例。
      </div>
      <a-table
        :columns="tableColumns"
        :dataSource="tableData"
        :pagination="false"
        style="width: 60%;"
      />
      <div class="item">
        对于一些特定接口需要自定义的错误，则按接口自身的错误处理需求进行定义，但不要与通用的http
        code和通用的自定义错误code冲突。
      </div>
      <div class="content-title">十、返回结果</div>
      <div class="item">
        针对不同操作，服务器向用户返回的结果应该符合以下规范。
      </div>
      <pre
        class="code"
        v-html="
          highlightCode(
            'GET /collection：返回资源对象的列表（数组）\n' +
              'GET /collection/resource：返回单个资源对象\n' +
              'POST /collection：返回新生成的资源对象\n' +
              'PUT /collection/resource：返回完整的资源对象\n' +
              'PATCH /collection/resource：返回完整的资源对象\n' +
              'DELETE /collection/resource：返回一个空文档'
          )
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import hljs from "highlight.js";

import "highlight.js/styles/tomorrow.css";
export default class ApiStandard extends Vue {
  tableColumns: any = [
    { title: "", dataIndex: "a" },
    { title: "error code", dataIndex: "b" },
    { title: "error message", dataIndex: "c" },
    { title: "comments", dataIndex: "d" }
  ];
  tableData: any = [
    {
      a: "自定义服务特有错误(10000开始)",
      b: "10000",
      c: "ReadFileError",
      d: "比如：模型读取文件错误",
      index: 1
    },
    {
      a: "",
      b: "10001",
      c: "ImageFormatError",
      d: "比如：图片格式不对，必需提供RGB格式",
      index: 2
    },
    {
      a: "",
      b: "10002",
      c: "WrongBatchSize",
      d: "比如：batchsize 必须是2的幂",
      index: 3
    },
    {
      a: "",
      b: "10003",
      c: "ImageLargeSize",
      d: "比如：上传图片太大，必须小于1MB",
      index: 4
    },
    {
      a: "",
      b: "10004",
      c: ".......",
      d: "其他自定义错误可以在RESTful文档中定义",
      index: 5
    }
  ];
  success: any =
    "{\n" +
    '  "code":0, //使用系统异常自定义状态码，非0的状态码\n' +
    '  "data":any    //任意类型：数组、基础类型、字符串、对象\n' +
    "}";
  fail: any =
    "{\n" +
    '  "code":500,   //使用系统异常自定义状态码，非0的状态码\n' +
    '  "error":"错误信息描述"\n' +
    "}";
  page: any =
    "{\n" +
    '  "code":0, //使用系统异常自定义状态码，非0的状态码\n' +
    '  "data":{\n' +
    '    "totalPages":22,    //总页数\n' +
    '    "page":1,               //当前页\n' +
    '    "per_page": 10,     //每页记录数\n' +
    '    "count": 220,           //总记录数\n' +
    '    "sortBy": null,     //排序字段\n' +
    '    "order":null,           //升序(true)/逆序(false)\n' +
    '    "data":[any]        //数据列表\n' +
    "  }\n" +
    "}";
  contentType: any =
    "POST /v1/animal HTTP/1.1\n" +
    "Host: api.example.org\n" +
    "Accept: application/json\n" +
    "Content-Type: application/json\n" +
    "Content-Length: 24\n" +
    "\n" +
    "{   \n" +
    '  "name": "Gir",\n' +
    '  "animalType": "12"\n' +
    "}";
  highlightCode(code: string) {
    return hljs.highlightAuto(code).value;
  }
}
</script>

<style scoped lang="scss">
.contain {
  text-align: left;
  width: 95%;
  margin: 1% auto;

  .title {
    font-size: 32px;
    line-height: 46px;
    margin-bottom: 42px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
  }

  .content-item {
    margin-bottom: 48px;

    .content-title {
      font-size: 24px;
      line-height: 34px;
      // margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
    }

    .item {
      margin-top: 16px;
      font-size: 20px;
      margin-bottom: 16px;
    }

    .sub-title {
      padding-top: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
    }

    .text {
      width: 800px;
      word-wrap: break-word;
      font-size: 16px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.45);
    }

    .table {
      min-width: 800px;
      max-width: 1400px;
    }

    .code {
      min-width: 800px;
      max-width: 1400px;
      padding: 20px;
      background-color: #f6f6fb;
      border: 1px solid #d6dde6;
      font-size: 18px;
    }
  }
}
.contain ul li {
  font-size: 20px;
}
.contain ul li ul {
  font-size: 20px;
  padding-left: 20px;
}
</style>
