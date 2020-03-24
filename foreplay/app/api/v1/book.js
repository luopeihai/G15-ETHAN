const Router = require("koa-router");
const router = new Router({
  prefix: "/v1/book"
});

const { PositiveIntegerValidator } = require("@validators/validator");
const { HotBook } = require("@models/hot-book");
const { Book } = require("@models/book");

//获取参数
// router.get("/v1/:id/book", async (ctx, next) => {
//   const error = new HttpException("跪求报错", 10001, 400);
//   throw error;
//   // ctx.body = ctx.params;
// });

// //body header query 参数获取
// router.post("/v1/book", async (ctx, next) => {
//   const postData = ctx.request.body;
//   const headers = ctx.request.header;
//   const query = ctx.request.query;
//   ctx.body = {
//     postData: postData, //body 值
//     token: headers.token, //头部带有token参数
//     query: query //url 参数
//   };
// });

// //报错
// router.get("/v1/error", async (ctx, next) => {
//   const error = new global.errs.ParameterException("跪求报错1", 10001, 400);
//   throw error;
//   ctx.body = ctx.params;
// });

// //id 验证
// router.get("/v1/:id/validate", async (ctx, next) => {
//   const val = await new PositiveIntegerValidator().validate(ctx);
//   ctx.body = val.get("path.id");
// });

// router.get("/v1/environment", async (ctx, next) => {
//   ctx.body = global.config.environment;
// });

//热门书籍
router.get("/hot_list", async (ctx, next) => {
  const books = await HotBook.getAll();
  ctx.body = {
    books
  };
});

//获取book详情
router.get("/:id/detail", async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const book = await new Book(v.get("path.id"));
  ctx.body = await book.getDetail();
});

module.exports = router;
