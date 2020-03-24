const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");
const util = require("util");
const axios = require("axios");

//书籍
class Book extends Model {
  constructor(id) {
    super();
    this.id = id;
  }
  //鱼书请求数据
  async getDetail() {
    const url = util.format(global.config.yushu.detailUrl, this.id);
    const detail = await axios.get(url);
    return detail.data;
  }

  //搜查
  static async searchFromYuShu(q, start, count, summary = 1) {
    const url = util.format(
      global.config.yushu.keywordUrl,
      encodeURI(q), //中文转码
      count,
      start,
      summary
    );
    const result = await axios.get(url);
    return result.data;
  }
}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      default: 0
    }
  },
  {
    sequelize,
    tableName: "book"
  }
);

module.exports = {
  Book
};
