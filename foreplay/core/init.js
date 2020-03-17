const Router = require("koa-router");
const requireDirectory = require("require-directory");

class InitManager {
  //静态方法
  static initCore(app) {
    // 入口方法
    InitManager.app = app;
    // 加载全部路由
    InitManager.initLoadRouters();
    // 异常处理
    InitManager.loadHttpException();
  }

  // 加载全部路由
  static initLoadRouters() {
    // 绝对路径
    // 获取绝对路径 process.cwd()
    const apiDirectory1 = `${process.cwd()}/app/api`;

    // 路由自动加载
    requireDirectory(module, apiDirectory1, {
      visit: whenLoadModule
    });

    // 判断 requireDirectory 加载的模块是否为路由
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes());
      }
    }
  }

  static loadHttpException() {
    const errors = require("./http-exception");
    //保存到全局 errs下面
    global.errs = errors;
  }
}

module.exports = InitManager;
