// 判断类型
function isThisType(val) {
  for (let key in this) {
    if (this[key] === val) {
      return true;
    }
  }
  return false;
}

//登录方式
const LoginType = {
  USER_MINI_PROGRAM: 100, //小程序
  USER_EMAIL: 101, //邮箱登录
  USER_MOBILE: 102, //手机登录
  ADMIN_EMAIL: 200, //管理员 邮箱登录
  isThisType
};

const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK: 400,
  isThisType
};

module.exports = {
  LoginType,
  ArtType
};
