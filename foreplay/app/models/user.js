const bcrypt = require("bcryptjs");

const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");

// 定义用户模型
class User extends Model {
  //通过邮箱 查询 用户
  static async verifyEmailPassword(email, plainPassword) {
    // 查询用户
    const user = await User.findOne({
      where: {
        email
      }
    });

    //账号不存在
    if (!user) {
      throw new global.errs.AuthFailed("账号不存在");
    }

    // 验证密码
    const correct = bcrypt.compareSync(plainPassword, user.password);

    if (!correct) {
      throw new global.errs.AuthFailed("密码不正确");
    }

    return user;
  }

  // 查询是否存在 opendid 的小程序用户
  static async getUserByOpenid(openid) {
    // 查询用户
    const user = await User.findOne({
      where: {
        openid
      }
    });
    return user;
  }

  // 注册小程用户
  static async createUserByOpenid(openid) {
    // 查询用户
    const user = await User.create({
      openid
    });
    return user;
  }
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER, //整数
      primaryKey: true, //主键
      autoIncrement: true //自增长
    },
    nickname: Sequelize.STRING, //字符串
    email: {
      type: Sequelize.STRING(128),
      unique: true //唯一
    },
    password: {
      // 扩展 设计模式 观察者模式
      // ES6 Reflect Vue3.0
      type: Sequelize.STRING,
      set(val) {
        // 加盐
        const salt = bcrypt.genSaltSync(10);
        // 生成加密密码
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue("password", psw);
      }
    },
    openid: {
      type: Sequelize.STRING(64), //长度64
      unique: true //唯一
    }
  },
  {
    sequelize,
    tableName: "user"
  }
);

module.exports = {
  User
};
