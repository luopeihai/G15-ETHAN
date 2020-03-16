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
