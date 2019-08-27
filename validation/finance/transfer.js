const Validator = require("validator");
const isEmpty = require("../is-empty");

module.exports = function transferValidate(data) {
  let errors = {};

  data.from = !isEmpty(data.from) ? data.from : "";
  data.to = !isEmpty(data.to) ? data.to : "";
  data.fromAmount = !isEmpty(data.fromAmount) ? data.fromAmount : "";
  data.toAmount = !isEmpty(data.toAmount) ? data.toAmount : "";

  if (Validator.isEmpty(data.from)) {
    errors.from = "From Account field is required";
  }

  if (Validator.isEmpty(data.to)) {
    errors.to = "To Account field is required";
  }

  if (Validator.isEmpty(data.fromAmount)) {
    errors.fromAmount = "Amount field is required";
  }

  if (Validator.isEmpty(data.toAmount)) {
    errors.toAmount = "Transaction type field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
