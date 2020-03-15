const Koa = require("koa");

//实例 Koa
const app = new Koa();

//注册
//ctx 上下文
//next 下一个中间件函数
app.use((ctx, next) => {});

//注册
app.use((ctx, next) => {});

//启动3000端口
app.listen(3000);
