const Router = require("koa-router");

const { TokenValidator, NotEmptyValidator } = require("../../validators/token");
const { LoginType } = require("../../lib/enum");
const { User } = require("../../models/user");

const { generateToken } = require("../../../core/util");
const { Auth } = require("../../../middlewares/auth");
const { WXManager } = require("../../services/wx");

//加前缀
const router = new Router({
  prefix: "/v1/token"
});

// 登录  获取 token
router.post("/", async ctx => {
  //格式判断
  const v = await new TokenValidator().validate(ctx);

  let token;
  // 登录方式：email || 小程序
  // API 权限 公开API
  // token 过期 不合法
  switch (v.get("body.type")) {
    // email登录
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.get("body.account"), v.get("body.secret"));
      break;

    // 小程序登录
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.get("body.account"));
      break;

    // 管理员登录
    case LoginType.ADMIN_EMAIL:
      break;

    default:
      throw new global.errs.ParameterException("没有相应的处理函数");
  }

  ctx.body = {
    token
  };
});

// 验证token
router.post("/verify", async ctx => {
  const v = await new NotEmptyValidator().validate(ctx);
  const result = Auth.verifyToken(v.get("body.token"));

  ctx.body = {
    isValid: result
  };
});

//邮箱登录
// 账号 + 密码
async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret);

  // 发布令牌
  // Auth.AUSE 为用户
  return generateToken(user.id, Auth.AUSE);
}

module.exports = router;
