const { Rule, LinValidator } = require("../../core/lin-validator-v2");

const { LoginType, ArtType } = require("../lib/enum");

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    //参数: 整数(必填),提示(必填),限制最小值 >= 1
    this.id = [new Rule("isInt", "需要正整数", { min: 1 })];
  }
}

function checkType(vals) {
  if (!vals.body.type) {
    throw new Error("type是必填参数");
  }

  if (!LoginType.isThisType(vals.body.type)) {
    throw new Error("type参数不合法");
  }
}

class Checker {
  constructor(type) {
    this.enumType = type;
  }

  check(vals) {
    let type = vals.path.type || vals.body.type;

    if (!type) {
      throw new Error("type是必填参数");
    }
    type = parseInt(type);

    if (!this.enumType.isThisType(type)) {
      throw new Error("type参数不合法1");
    }
  }
}

//验证type 类型
class ClassicValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    const checker = new Checker(ArtType);
    this.validateType = checker.check.bind(checker);
  }
}

class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.validateType = checkType;
  }
}

module.exports = {
  PositiveIntegerValidator,
  LikeValidator,
  ClassicValidator
};
