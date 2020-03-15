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

1. 中间件已**_"洋葱模型"_**一样被调用
2. next 返回为 Promise
