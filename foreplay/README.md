# 姿势准备

主要为 npm koa2

## 使用到技术或工具

- node(10.15)
- koa2
- mysql
- nactive
- 微信开发工具
- VS
- postMan
- nodemon
- pm2

## 搭建项目

1. npm init
2. npm i koa --save (安装 koa)
3. 创建启动文件 app.js,引入 Koa

   ```
    const Koa = require("koa");

    //实例 Koa
    const app = new Koa();

    //启动3000端口
    app.listen(3000);
   ```

## koa 洋葱模式

添加 app.js 代码,执行 app.js --> node app

```
//注册中间件
//ctx 上下文
//next 下一个中间件函数
app.use((ctx, next) => {
  console.log(1);
  //next 返回类型为 Promise
  const Promise = next();
  console.log(Promise);
  console.log(2);
});

//注册中间件
app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
});
```

访问:localhost:3000 输出 **_1 3 4 Promise { undefined } 2_** 说明:

1. 中间件已 **_"洋葱模型"_** 一样被调用
2. next 返回为 Promise

## async 与 await

app.js next()异步回调 使用 async 与 await 简写

```
app.use(async (ctx, next) => {
  console.log(1);
  const Promise =await next();
  console.log(Promise);
  console.log(2);
});

```

## koa-router 路由

1. npm 引用第三方路由

```
npm i koa-router --save
```

2. 代码路由引入

```
const Koa = require("koa");
const Router = require("koa-router"); //引入Route
//实例 Koa
const app = new Koa();

//实例路由
const router = new Router();

router.get("/classic/latest", (ctx, next) => {
  ctx.body = { data: "router调用页面" };
});

app.use(router.routes());

//启动3000端口
app.listen(3000);

```

3. 访问http://localhost:3000/classic/latest 页面输出 {"data":"router 调用页面"}

### 路由拆分

1. 安装 rest 规则定义 接口,创建 api / v1 文件
2. 新建 book.js 和 classic.js,举 book.js 内部代码为例

   ```
   const Router = require("koa-router");
   const router = new Router();

   router.get("/v1/book", async (ctx, next) => {
   ctx.body = {
       key: "book"
   };
   });

   module.exports = router;
   ```

3. 修改启动文件 app.js

   ```
   const Koa = require("koa");
    //实例 Koa
    const app = new Koa();

    const book = require("./api/v1/book");
    const classic = require("./api/v1/classic");

    app.use(book.routes());
    app.use(classic.routes());

    //启动3000端口
    app.listen(3000);
   ```

   4.浏览器访问http://localhost:3000/v1/book ,显示:{"key":"book"}

### 安装 nodemon

> nodemon 代码修改自动更新

1. npm i nodemon -g 全局安装 nodemon
2. nodemon app 启动 app ,这时 node 文件修改将自动打包

### require-directory 引入

> require-directory 为读取指定文件下文件

1. npm i require-directory --save
2. 修改 app 代码

   ```
   const Koa = require("koa");
    //实例 Koa
    const app = new Koa();
    const Router = require("koa-router");
    const requireDirectory = require("require-directory");

    //读取指定文件 遍历
    requireDirectory(module, "./api", function() {
    visit: whenLoadModule;
    });

    function whenLoadModule(obj) {
    if (obj instanceof Router) {
        //遍历对象有 Router的.js
        app.use(obj.routes()); //注册路由
    }
    }

    //启动3000端口
    app.listen(3000);

   ```

   通过 require-directory 库方便批量导入路由,而不需要手动添加

### 路由加载优化文件

1. 根目录下创新 文件夹"app",把 api 拉入 app 中
2. 创建项目启动后的初始化页面,根目录下创新 文件夹"core",文件夹内创建 init.js,添加路由代码

   ```
   const Router = require("koa-router");
    const requireDirectory = require("require-directory");

    class InitManager {
    //静态方法
    static initCore(app) {
        // 入口方法
        InitManager.app = app;
        // 加载全部路由
        InitManager.initLoadRouters();
    }

    // 加载全部路由
    static initLoadRouters() {
        // 绝对路径
        // 获取绝对路径 process.cwd()
        const apiDirectory = `${process.cwd()}/app/api`;

        // 路由自动加载
        requireDirectory(module, apiDirectory, {
        visit: whenLoadModule
        });

        // 判断 requireDirectory 加载的模块是否为路由
        function whenLoadModule(obj) {
        if (obj instanceof Router) {
            InitManager.app.use(obj.routes());
        }
        }
    }
    }

    module.exports = InitManager;

   ```

   3.根目下 app.js 修改,把路由加载放到 InitManager 中,而 app 尽量缩减代码

   ```
   const Koa = require("koa");
   //实例 Koa
   const app = new Koa();

   //初始化
   const InitManager = require("./core/init");
   //调用InitManager 静态方法
   InitManager.initCore(app);

   //启动3000端口
   app.listen(3000);

   ```

### 传参方式

这里我们用 book.js 为事例

1. 路劲中的参数 如: /v1/:id/book 获取 id:

   ```
    router.get("/v1/:id/book", async (ctx, next) => {
      ctx.body = ctx.params;
    });
   ```

   访问:http://localhost:3000/v1/1/book
   结果:{ id: '1' }

2. post 中 body 获取 ,为了方便获取 body 使用中间件 koa-bodyparser

```
   //安装中间件
   npm i koa-bodyparser --save

   //app.js
   // 中注册koa-bodyparser中间件
   const parser = require('koa-bodyparser')
   //这段代码优选与 路由注册
   app.use(parser())

   //book.js
   //接受post
   router.post("/v1/book/post", async (ctx, next) => {
      ctx.body = ctx.request.body;
    });
```

请求:post 路劲:/v1/book body 体:{
"key":"hello"
}

显示:{
"key":"hello"
}

3. 获取 header 中参数

```
 //比如获取header 中的token
 const token = ctx.request.header.token
```

4. 获取 query 查询参数

```
  //如请求为 localhost:3000/v1/book?param=queryValue
  console.log(ctx.request.query)   // {"param": "queryValue" }
```

### 全局异步处理中间件

1. /core 下创建错误对象 文件 http-exception ,代码如下

   ```
   //请求错误
   class HttpException extends Error {
      constructor(msg = "服务器异常", errorCode = 10000, code = 400) {
         super();
         this.errorCode = errorCode;
         this.code = code;
         this.msg = msg;
      }
   }

   ```

2. /middlewares 下创建捕捉异常中间件 exception,代码如下:

   ```
   const { HttpException } = require("../core/http-exception");

   const catchError = async (ctx, next) => {
   try {
      await next();
   } catch (error) {

      if (error instanceof HttpException) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      };
      ctx.status = error.code;
    } else {
      //未知异常
      ctx.body = {
        msg: "未知错误",
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`
      };
      ctx.status = 500;
    }
   }
   };

   module.exports = catchError;
   ```

   3.app.js 注册 exception.js 中间件

   ```
      //全局异常处理中间件
      const catchError = require("./middlewares/exception");

      //注册中间件
      app.use(catchError);
   ```

3. error 对象 挂载到全局 errs 下面,修改 /core/init.js 代码
   ```
   ...
   //静态方法
   static initCore(app) {
      .....
      // 异常处理
      InitManager.loadHttpException();
   }
   ....
    static loadHttpException() {
      const errors = require("./http-exception");
      //error对象 挂载到全局 errs下面
      global.errs = errors;
    }
   ...
   ```
4. /app/api/v1/book.js 内 添加 错误调用接口

   ```
   //报错
   router.get("/v1/error", async (ctx, next) => {
      const error = new global.errs.HttpException("跪求报错1", 10001, 400);
      throw error;
   });
   ```

   显示 {"msg":"跪求报错 1","error_code":10001,"request":"GET /v1/error"}

## Lin-Validator 参数验证

1. 安装 lodash, validator 库 npm i lodash validator --save

2. /core 引入**_林间有风_**优秀的校验 js lin-validator-v2.js 和 util.js

3. /app 创建 validators/validator.js,代码如下

   ```
   const { Rule, LinValidator } = require("../../core/lin-validator-v2");

   class PositiveIntegerValidator extends LinValidator {
   constructor() {
      super();
      //参数: 整数(必填),提示(必填),限制最小值 >= 1
      this.id = [new Rule("isInt", "需要正整数", { min: 1 })];
   }
   }

   module.exports = {
   LikeValidator
   };

   ```

4./app/api/v1 添加测试代码

```
   router.get("/v1/:id/validate", async (ctx, next) => {
   const val = await new PositiveIntegerValidator().validate(ctx);
   ctx.body = val.get("path.id");
   });

```

真去地址:
请求地址为:http://localhost:3000/v1/1/validate 输出 1

id=-1 的错误地址:请求地址为:http://localhost:3000/v1/-1/validate 输出 {"msg":["id 需要正整数"],"error_code":10000,"request":"GET /v1/-1/validate"}

## 配置生产环境 和 开发环境

1. 创建 /config/config.js 代码,environment 设置为 dev 开发环境

```
   module.exports = {
   environment: "dev" //production
   };
```

2. /core/init 中 把配置加载到全局变量

```
  static initCore(app) {
    ...
    //配置挂载到全局
    InitManager.loadConfig();
  }

  static loadConfig(path = "") {
    const configPath = path || process.cwd() + "/config/config.js";
    const config = require(configPath);
    //配置挂载到 全局
    global.config = config;
  }
```

3./app/api/v1/book 添加获取 environment 接口

```
router.get("/v1/environment", async (ctx, next) => {
  ctx.body = global.config.environment;
});

```

请求:http://localhost:3000/v1/environment

返回:dev

# mysql 数据库操作

1. 创建 foreplay 数据库
2. 安装依赖库 sequelize ,bcryptjs (密码加密) ,mysql2 (mysql 依赖)

```
npm i sequelize bcryptjs mysql2 -S
```

3. 修改 /config/config.js 配置数据库参数

   ```
   module.exports = {
   environment: "dev", //production
   database: {
      dbName: "foreplay",
      host: "localhost",
      port: 3306,
      user: "root",
      password: "root"
   }
   };
   ```

4. 创建 /core/db.js sequelize 基类

   ```
   const Sequelize = require('sequelize')

   const {
      dbName,
      host,
      port,
      user,
      password
   } = require('../config/config').database

   const sequelize = new Sequelize(dbName, user, password, {
      dialect: 'mysql', //连接msyql数据库
      host,
      port,
      logging: true,//操作显示
      timezone: '+08:00', //市区 为北京时间
      define: {
         // create_time && update_time
         timestamps: true,
         // delete_time
         paranoid: true,
         createdAt: 'created_at',
         updatedAt: 'updated_at',
         deletedAt: 'deleted_at',
         // 把驼峰命名转换为下划线
         underscored: true,
         freezeTableName: true,
         scopes: {
               bh: {
                  attributes: {
                     exclude: ['updated_at', 'deleted_at', 'created_at']
                  }
               }
         }
      }
   })

   // 创建模型
   sequelize.sync({
   force: false
   })

   module.exports = {
   sequelize
   }
   ```

5. 创建 model user 用户 model /app/models/user.js

```
   const bcrypt = require("bcryptjs");
   const { sequelize } = require("../../core/db");
   const { Sequelize, Model } = require("sequelize");
   // 定义用户模型
   class User extends Model {}
   User.init(
   {
   id: {
      type: Sequelize.INTEGER, //整数
      primaryKey: true, //主键
      autoIncrement: true //自增长
   },
   nickname: Sequelize.STRING, //字符串
   email: {
      type: Sequelize.STRING(128),
      unique: true //唯一
   },
   password: {
   // 扩展 设计模式 观察者模式
   // ES6 Reflect Vue3.0
   type: Sequelize.STRING,
   set(val) {
      // 加密
      const salt = bcrypt.genSaltSync(10);
      // 生成加密密码
      const psw = bcrypt.hashSync(val, salt);
      this.setDataValue("password", psw);
   }
   },
   openid: {
      type: Sequelize.STRING(64), //长度 64
      unique: true //唯一
   }
   },
   {
      sequelize,
      tableName: "user"
   }
   );

   module.exports = {
      User
   };

```

6.根目录创建 dbOp.js ,代码如下

```
  require("./app/models/user");
```

node dbOp 执行 user 创建数据表

## 创建用户

1. /app/validators 下 创建验证类 user.js
2. /api/v1 下 创建 user 请求处理 user.js

   ```
   // 用户注册
   router.post("/register", async ctx => {
   const v = await new RegisterValidator().validate(ctx);
   const user = {
      email: v.get("body.email"),
      password: v.get("body.password2"),
      nickname: v.get("body.nickname")
   };

   const r = await User.create(user);

   handleResult("注册成功");
   });
   ```

3. postman 创造请求 post localhost:3000/v1/user/register 选择 body 选择 raw --> JSON 形式 body 内容:

```
 //json
 {
      "email":"459114230@qq.com",
      "nickname":"lph1",
      "password1":"123456$",
      "password2":"123456$"
   }

```

## 密码加密

1. 引用加密库 bcryptjs
   ```
   npm i bcryptjs --save
   ```
2. /app/models/user.js 修改 sequelize 中 password 写入操作

   ```
   const bcrypt = require("bcryptjs");
   ...
   User.init({
      ...
           password: {
               // 扩展 设计模式 观察者模式
               // ES6 Reflect Vue3.0
               type: Sequelize.STRING,
               set(val) {
                  // 加盐
                  const salt = bcrypt.genSaltSync(10);
                  // 生成加密密码
                  const psw = bcrypt.hashSync(val, salt);
                  this.setDataValue("password", psw);
               }
            },
      ...
   })
   ...

   ```

### 邮箱登录 获取 token

1.token 生成使用 JWT ,按照 JWT 库:npm i jsonwebtoken --save

### token 校验

1. 安装 basic-auth 库 ,获取 HTTP 规定 身份验证机制 HttpBasicAuth,下的 token
2. 创建路由 /app/api/v1/classic.js

   ```
     const Router = require("koa-router");
      const router = new Router({
      prefix: "/v1/classic"
      });

      const { Auth } = require("../../../middlewares/auth");
      const {
      PositiveIntegerValidator,
      ClassicValidator
      } = require("../../validators/classic");

      router.get("/latest", new Auth().m, async (ctx, next) => {
      ctx.body = ctx.auth.uid;
      });
   ```

   3. 创建验证 token 有效性中间件 /middlewares/auth.js

      ```
      const basicAuth = require("basic-auth");
      const jwt = require("jsonwebtoken");

      class Auth {
      constructor(level) {
         this.level = level || 1; //权限等级
         Auth.AUSE = 8; //用户
         Auth.ADMIN = 16; //管理员
         Auth.SPUSER_ADMIN = 32; //超级管理员
      }

      get m() {
         // token 检测
         // token 开发者 传递令牌
         // token body header
         // HTTP 规定 身份验证机制 HttpBasicAuth
         return async (ctx, next) => {
            //获取token信息
            const tokenToken = basicAuth(ctx.req);

            let errMsg = "token不合法";

            // 无带token
            if (!tokenToken || !tokenToken.name) {
            throw new global.errs.Forbidden(errMsg);
            }

            try {
            var decode = jwt.verify(
               tokenToken.name,
               global.config.security.secretKey
            );
            } catch (error) {
            // token 不合法 过期
            if (error.name === "TokenExpiredError") {
               errMsg = "token已过期";
            }

            throw new global.errs.Forbidden(errMsg);
            }
      ```


            ctx.auth = {
            uid: decode.uid, //获取id
            scope: decode.scope //生成token 带的参数
            };

            await next();
         };
      }

      // 验证token是否有效
      static verifyToken(token) {
         try {
            jwt.verify(token, global.config.security.secretKey);

            return true;
         } catch (e) {
            return false;
         }
      }
      }

      module.exports = {
      Auth
      };

      ```

4.  postman 访问 ,按照 HttpBasicAuth 规范,选择 Authorization --> Basic Auth(TYPE 选择) --> Username 输入框 填入 token

### auth 权限

> 登录时候 加入等级参数 生成 token , 当权访问权限接口时候,解析 token 拿到等级参数

1.在 token 验证通过后 获取 scope 进行权限判断 /middlewares/auth.js

```
   if (decode.scope <= this.level) {
        errMsg = "权限不足";
        throw new global.errs.Forbidden(errMsg);
   }

```

### 创建小程序

1. 登录微信开放平台 [下载微信小程序开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)
2. 创建小程序 选择测试号
3. 开启 npm 模块 步骤:设置-->项目-->本地配置-->使用 npm 模块
4. 构建 lin-ui 库

- 右键 page 文件 --> 在终端中打开 在回退到小程序根目录
- npm init 初始 npm
- lin-ui 库引入 npm i lin-ui --save
- 工具 --> 构建 npm

### 微信登录

1. 新建 小程序业务层 /app/services/wx.js
2. 由于需要请求小程序后台 获取 openid 所以安装库 axios
3. 设置项目不验证请求域名 步骤: 设置 --> 项目设置 --> 不校验合法域名... 打钩

### 验证 token

### 获取最新期刊

1. .sql 导入
2. 获取最新期刊为需要 token 验证,所以请求头 header Authorization 塞入规范的 base64 格式的 token,这里需要引入 js-base64 包

```
npm i js-base64 --save
```

之后 工具 --> 构建 npm,引入小程序中

```
import {Base64 } from 'js-base64'
```

### 获取最新期刊点赞

### alias 别名注册

> 很多时候引用对象 需要很多根路径,但可以通过 module-alias 库,通过别名形式引用 对象

1. npm i module-alias --save
2. package.json 下添加:
   ```
   "_moduleAliases": {
      "@root": ".",
      "@models": "app/models",
      "@validators": "app/validators",
      "@middlewares": "middlewares"
   }
   ```
3. 注册 module-alias , 在 app.js 中引入 module-alias
   ```
      "_moduleAliases": {
         "@root": ".",
         "@models": "app/models",
         "@validators": "app/validators",
         "@middlewares": "middlewares"
      }
   ```

### 我的点赞期刊

### 热销书籍查询

### 书籍

### 获取 book 详情

### book 搜索书籍

### 获取我点赞的数量

### book 点赞数
