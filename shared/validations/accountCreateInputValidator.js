const Validator = require('validatorjs');

exports.createUserValidator = (createTokenReq) => {

    let rules = {
        fullname: 'required|string',
        username: 'required|string',
        password: 'required|string',
        email: 'required|email',
        role: ['required', {'in': ['Administrator', 'User']}],
        pacientId: [{required_if: ['role', 'User']}, 'regex:/^[0-9a-fA-F]{24}$/i'],
    };

    let validation = new Validator(createTokenReq, rules);
    validation.check();

    return validation;
}