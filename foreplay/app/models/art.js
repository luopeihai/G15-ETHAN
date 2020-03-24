const { Movie, Music, Sentence } = require("./classic");
const { flatten } = require("lodash");
const { Op } = require("sequelize");

class Art {
  //查询报刊集合
  static async getList(artInfoList) {
    //
    const arts = [];
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    };
    //遍历对象
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    //遍历数组
    for (let key in artInfoObj) {
      const ids = artInfoObj[key];
      if (ids.length === 0) {
        //数组为空
        continue; //继续循环
      }
      //查询
      arts.push(await Art._getListByType(ids, parseInt(key)));
      return flatten(arts);
    }
  }

  //接受 ids 集合
  // type 类型
  static async _getListByType(ids, type) {
    let arts = [];
    const finder = {
      where: {
        id: {
          [Op.in]: ids //使用in 搜索
        }
      }
    };

    switch (type) {
      case 100:
        arts = await Movie.findAll(finder);
        break;
      case 200:
        arts = await Music.findAll(finder);
        break;
      case 300:
        arts = await Sentence.findAll(finder);
        break;
      default:
        break;
    }

    return arts;
  }

  static async getData(artId, type, useScope = true) {
    let art = null;
    const finder = {
      where: {
        id: artId
      }
    };

    const scope = useScope ? "bh" : null;
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder);
        break;
      case 200:
        art = await Music.scope(scope).findOne(finder);
        break;
      case 300:
        art = await Sentence.scope(scope).findOne(finder);
        break;
      case 400:
        break;
      default:
        break;
    }

    return art;
  }
}

module.exports = {
  Art
};
