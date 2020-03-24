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
