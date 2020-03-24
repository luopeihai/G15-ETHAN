const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
    type: Sequelize.INTEGER,
    default: 0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT
};

// 电影
class Movie extends Model {}

Movie.init(classicFields, {
  sequelize,
  tableName: "movie"
});

//
class Sentence extends Model {}

Sentence.init(classicFields, {
  sequelize,
  tableName: "sentence"
});

// 音乐
class Music extends Model {}

//拷贝
//如果目标对象中的属性具有相同的键，则属性将被源中的属性覆盖。后来的源的属性将类似地覆盖早先的属性。
const musicFields = Object.assign({ url: Sequelize.STRING }, classicFields);

Music.init(musicFields, {
  sequelize,
  tableName: "music"
});

module.exports = {
  Movie,
  Sentence,
  Music
};
