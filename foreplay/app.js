const Koa = require("koa");
//实例 Koa
const app = new Koa();

const book = require("./api/v1/book");
const classic = require("./api/v1/classic");

app.use(book.routes());
app.use(classic.routes());

//启动3000端口
app.listen(3000);
