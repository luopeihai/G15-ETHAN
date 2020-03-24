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
    // 一个月 (秒为单位)
    expiresIn: 60 * 60 * 24 * 30
  },
  wx: {
    appId: "wx12685218aef611c2",
    appSecret: "04bbccd38984951bf8ccd1df3116469b",
    loginUrl:
      "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
  },
  yushu: {
    //鱼书配置
    detailUrl: "http://t.yushu.im/v2/book/id/%s",
    keywordUrl:
      "http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s"
  }
};
