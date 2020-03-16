const Router = require("koa-router");
const router = new Router();

router.get("/v1/book", async (ctx, next) => {
  ctx.body = {
    key: "book1"
  };
});

//获取参数
router.get("/v1/:id/book", async (ctx, next) => {
  const path = ctx.request.param;
  console.log(path);
  ctx.body = {
    key: "book1"
  };
});

module.exports = router;
