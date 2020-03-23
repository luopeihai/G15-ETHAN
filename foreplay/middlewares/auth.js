const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");

class Auth {
  constructor(level) {
    this.level = level || 1; //初始权限 权限等级
    Auth.AUSE = 8; //用户
    Auth.ADMIN = 16; //管理员
    Auth.SPUSER_ADMIN = 32; //超级管理员
  }

  get m() {
    // token 检测
    // token 开发者 传递令牌
    // token body header
    // HTTP 规定 身份验证机制 HttpBasicAuth
    return async (ctx, next) => {
      //获取token信息
      const tokenToken = basicAuth(ctx.req);

      let errMsg = "token不合法";

      // 无带token
      if (!tokenToken || !tokenToken.name) {
        throw new global.errs.Forbidden(errMsg);
      }

      try {
        var decode = jwt.verify(
          tokenToken.name,
          global.config.security.secretKey
        );
      } catch (error) {
        // token 不合法 过期
        if (error.name === "TokenExpiredError") {
          errMsg = "token已过期";
        }

        throw new global.errs.Forbidden(errMsg);
      }

      if (decode.scope <= this.level) {
        errMsg = "权限不足";
        throw new global.errs.Forbidden(errMsg);
      }

      ctx.auth = {
        uid: decode.uid, //获取id
        scope: decode.scope //生成token 带的参数
      };

      await next();
    };
  }

  // 验证token是否有效
  static verifyToken(token) {
    try {
      //
      jwt.verify(token, global.config.security.secretKey);

      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = {
  Auth
};
