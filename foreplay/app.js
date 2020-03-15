const Koa = require("koa");
//实例 Koa
const app = new Koa();
const Router = require("koa-router");
const requireDirectory = require("require-directory");

//读取指定文件
requireDirectory(module, "./api", function() {
  visit: whenLoadModule;
});

function whenLoadModule(obj) {
  if (obj instanceof Router) {
    //遍历对象有 Router的.js
    app.use(obj.routes()); //注册路由
  }
}

//启动3000端口
app.listen(3000);
