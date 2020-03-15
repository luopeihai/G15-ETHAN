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
