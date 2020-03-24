const { sequelize } = require("../../core/db");
const { Sequelize, Op, Model } = require("sequelize");
const { Favor } = require("./favor");

class HotBook extends Model {
  //按照排序 获取所有书籍 和对应书籍的点赞次数
  static async getAll() {
    const books = await HotBook.findAll({
      oreder: ["index"]
    });
    //获取books id集合
    const ids = [];
    books.forEach(book => {
      ids.push(book.id);
    });

    //书籍被点赞过 并查出点赞次数
    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids
        },
        type: 400 //为图书
      },
      group: ["art_id"], //分组
      //需要的字段
      //
      attributes: [
        "art_id",
        [
          Sequelize.fn("COUNT", "*"), //求和
          "count"
        ]
      ]
    });

    return books.map(book => HotBook._getEachBookStatus(book, favors));

    // return books;
  }

  //获取每本书的点赞总数
  static _getEachBookStatus(book, favors) {
    let count = 0;
    favors.forEach(favor => {
      if (book.id === favor.art_id) {
        count = favor.get("count");
      }
    });

    book.setDataValue("count", count);
    return book;
  }
}

HotBook.init(
  {
    index: Sequelize.INTEGER, //书籍排序
    image: Sequelize.STRING, //图片
    author: Sequelize.STRING, //作者
    title: Sequelize.STRING //标题
  },
  {
    sequelize,
    tableName: "hot_book"
  }
);

module.exports = {
  HotBook
};
