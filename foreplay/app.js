const Koa = require("koa");
//实例 Koa
const app = new Koa();

//初始化
const InitManager = require("./core/init");
//调用InitManager 静态方法
InitManager.initCore(app);

//启动3000端口
app.listen(3000);
