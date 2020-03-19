module.exports = {
  environment: "dev", //production
  database: {
    //数据库
    dbName: "foreplay",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root"
  },
  security: {
    //安全
    secretKey: "abcdefg",
    // 过期时间 1小时
    expiresIn: 60 * 60
  }
};
