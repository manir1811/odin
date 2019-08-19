const Validator = require("validator");
const isEmpty = require("../is-empty");

module.exports = function transactionValidate(data) {
  let errors = {};

  data.desc = !isEmpty(data.desc) ? data.desc : "";
  data.category = !isEmpty(data.category) ? data.category : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.account = !isEmpty(data.account) ? data.account : "";

  if (Validator.isEmpty(data.desc)) {
    errors.desc = "Description field is required";
  }

  if (Validator.isEmpty(data.category)) {
    errors.category = "Category field is required";
  }

  if (Validator.isEmpty(data.amount)) {
    errors.amount = "Amount field is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Transaction type field is required";
  }

  if (Validator.isEmpty(data.account)) {
    errors.account = "Account field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
