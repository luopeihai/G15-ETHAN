const Sequelize = require("sequelize");

const {
  dbName,
  host,
  port,
  user,
  password
} = require("../config/config").database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: "mysql", //连接msyql数据库
  host,
  port,
  logging: true, //操作显示
  timezone: "+08:00", //市区 为北京时间
  define: {
    // create_time && update_time
    timestamps: true,
    // delete_time
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    // 把驼峰命名转换为下划线
    underscored: true,
    freezeTableName: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ["updated_at", "deleted_at", "created_at"]
        }
      }
    }
  }
});

// 创建模型
sequelize.sync({
  force: false //false 不创建
});

module.exports = {
  sequelize
};
