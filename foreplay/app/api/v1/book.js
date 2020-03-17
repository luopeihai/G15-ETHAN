const Router = require("koa-router");
const router = new Router();

//获取参数
router.get("/v1/:id/book", async (ctx, next) => {
  const error = new HttpException("跪求报错", 10001, 400);
  throw error;
  // ctx.body = ctx.params;
});

router.post("/v1/book", async (ctx, next) => {
  const postData = ctx.request.body;
  const headers = ctx.request.header;
  const query = ctx.request.query;
  ctx.body = {
    postData: postData, //body 值
    token: headers.token, //头部带有token参数
    query: query //url 参数
  };
});

//报错
router.get("/v1/error", async (ctx, next) => {
  const error = new global.errs.HttpException("跪求报错1", 10001, 400);
  throw error;
  // ctx.body = ctx.params;
});

module.exports = router;
