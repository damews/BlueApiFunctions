const Validator = require('validatorjs');

exports.createTokenValidator = (createTokenReq) => {
  const rules = {
    userId: ['required', 'regex:/^[0-9a-fA-F]{24}$/i'],
  };

  const validation = new Validator(createTokenReq, rules);
  validation.check();

  return validation;
};
