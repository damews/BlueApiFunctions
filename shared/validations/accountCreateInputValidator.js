const Validator = require('validatorjs');

exports.createUserValidator = (createTokenReq) => {
  const rules = {
    fullname: 'required|string',
    username: 'required|string',
    password: 'required|string',
    email: [{ required_if: ['role', 'Administrator'] }, 'email'],
    role: ['required', { in: ['Administrator', 'User'] }],
    pacientId: [{ required_if: ['role', 'User'] }, 'regex:/^[0-9a-fA-F]{24}$/i'],
  };

  const validation = new Validator(createTokenReq, rules);
  validation.check();

  return validation;
};
