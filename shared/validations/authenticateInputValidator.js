const Validator = require('validatorjs');

exports.authenticateValidator = (authenticateReq) => {
  const rules = {
    username: 'required|string',
    password: 'required|string',
  };

  const validation = new Validator(authenticateReq, rules);
  validation.check();

  return validation;
};
