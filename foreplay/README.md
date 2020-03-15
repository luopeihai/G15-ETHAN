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

## 路由

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
