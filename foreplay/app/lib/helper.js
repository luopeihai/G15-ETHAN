function handleResult(msg, errorCode) {
  //抛出  成功消息
  throw new global.errs.Success(msg, errorCode);
}

module.exports = {
  handleResult
};
