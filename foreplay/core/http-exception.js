//请求错误
class HttpException extends Error {
  constructor(msg = "服务器异常", errorCode = 10000, code = 400) {
    super();
    this.errorCode = errorCode;
    this.code = code;
    this.msg = msg;
  }
}

//参数错误
class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 400;
    this.msg = msg || "参数错误";
    this.errorCode = errorCode || 10000;
  }
}

//成功
class Success extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 201;
    this.msg = msg || "success";
    this.errorCode = errorCode || 0;
  }
}

//资源没找到
class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 404;
    this.msg = msg || "资源未找到";
    this.errorCode = errorCode || 10000;
  }
}

//授权失败
class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 401;
    this.msg = msg || "授权失败";
    this.errorCode = errorCode || 10004;
  }
}

//禁止访问
class Forbidden extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 403;
    this.msg = msg || "禁止访问";
    this.errorCode = errorCode || 10006;
  }
}

//你已经点赞过
class linkError extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 400;
    this.msg = msg || "你已经点赞过";
    this.errorCode = errorCode || 60001;
  }
}

//你已取消点赞
class DislikeError extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 400;
    this.msg = msg || "你已取消点赞";
    this.errorCode = errorCode || 60002;
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbidden,
  linkError,
  DislikeError
};
