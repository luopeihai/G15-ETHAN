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

### VS 断点调试

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
2. 根目录下创新 文件夹"core",文件夹内创建 init.js,添加路由代码

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
    router.post("/v1/:id/book", async (ctx, next) => {
      ctx.body = ctx.params;
    });
   ```

   访问:http://localhost:3000/v1/1/book
   结果:{ id: '1' }

2. post 中 body 获取 ,为了方便获取 使用中间件 koa-bodyparser

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
3. 获取header中参数 
```
 //比如获取header 中的token
 const token = ctx.request.header.token
```
4. 获取query查询参数
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
      }
   }
   };

   module.exports = catchError;
   ```
3.app.js 注册exception.js中间件

   ```
      //全局异常处理中间件
      const catchError = require("./middlewares/exception");

      //注册中间件
      app.use(catchError);
   ```
1. error对象 挂载到全局 errs下面,修改init.js代码
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
2. /app/api/v1/book.js 内 添加 错误调用接口 
   ```
   //报错
   router.get("/v1/error", async (ctx, next) => {
      const error = new global.errs.HttpException("跪求报错1", 10001, 400);
      throw error;
   });
   ``` 
   显示  {"msg":"跪求报错1","error_code":10001,"request":"GET /v1/error"}    
   
