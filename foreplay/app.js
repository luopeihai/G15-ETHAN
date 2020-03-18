const Koa = require("koa");
//实例 Koa
const app = new Koa();
//对post body 获取的中间件
const parser = require("koa-bodyparser");
//全局异常处理中间件
const catchError = require("./middlewares/exception");

//注册中间件
app.use(catchError);

//优先于 router注册
app.use(parser());

//初始化
const InitManager = require("./core/init");
//调用InitManager 静态方法
InitManager.initCore(app);

//启动3000端口
app.listen(3000);
