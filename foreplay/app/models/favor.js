const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");

const { Art } = require("./art");

class Favor extends Model {
  // 业务表
  // 添加记录
  // fave_num
  // ACID 一致性 一致性 隔离性  持久性
  //点赞
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });

    //存在 说明已经点赞过
    if (favor) {
      throw new global.errs.linkError();
    }
    return sequelize.transaction(async t => {
      await Favor.create(
        {
          art_id,
          type,
          uid
        },
        { transaction: t }
      );

      const art = await Art.getData(art_id, type, false);
      //fav_nums 点赞数加1 和提交事务
      await art.increment("fav_nums", { by: 1, transaction: t });
    });
  }

  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });
    if (!favor) {
      throw new global.errs.DislikeError();
    }

    return sequelize.transaction(async t => {
      await favor.destroy({
        force: false, // 软删除  true 为物理删除
        transaction: t
      });

      const art = await Art.getData(art_id, type, false);
      //递减 1
      await art.decrement("fav_nums", { by: 1, transaction: t });
    });
  }

  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });
    return !!favor;
  }
}

Favor.init(
  {
    uid: Sequelize.UUID,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
  },
  {
    sequelize,
    tableName: "favor"
  }
);

module.exports = {
  Favor
};
