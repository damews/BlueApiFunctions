const Validator = require('validatorjs');

exports.createTokenValidator = (createTokenReq) => {

    let rules = {
        userId: ['required', 'regex:/^[0-9a-fA-F]{24}$/i']
    };

    let validation = new Validator(createTokenReq, rules);
    validation.check();

    return validation;
}