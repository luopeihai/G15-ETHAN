const Koa = require("koa");

//实例 Koa
const app = new Koa();

//注册 中间件
//ctx 上下文
//next 下一个中间件函数
app.use((ctx, next) => {
  console.log(1);
  const Promise = next();
  console.log(Promise);
  console.log(2);
});

//注册 中间件
app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
});

//启动3000端口
app.listen(3000);
