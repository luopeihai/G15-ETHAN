const Router = require("koa-router");
const router = new Router({
  prefix: "/v1/like"
});

const { LikeValidator } = require("../../validators/validator");

const { Auth } = require("../../../middlewares/auth");
const { Favor } = require("@models/favor");

const { handleResult } = require("../../lib/helper");

//点赞
router.post("/", new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx, {
    id: "art_id"
  });

  await Favor.like(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid);

  handleResult();
});

//取消点赞
router.post("/cancel", new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx, {
    id: "art_id"
  });

  await Favor.dislike(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid);

  handleResult();
});

module.exports = router;
