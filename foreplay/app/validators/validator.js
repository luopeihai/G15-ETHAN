const { Rule, LinValidator } = require("../../core/lin-validator-v2");

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    //参数: 整数(必填),提示(必填),限制最小值 >= 1
    this.id = [new Rule("isInt", "需要正整数", { min: 1 })];
  }
}

module.exports = {
  PositiveIntegerValidator
};
