const Validator = require("validator");
const isEmpty = require("../is-empty");

module.exports = function accountValidation(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.currency = !isEmpty(data.currency) ? data.currency : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Account Name field is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Account Type field is required";
  }

  if (Validator.isEmpty(data.currency)) {
    errors.currency = "Account Currency field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
