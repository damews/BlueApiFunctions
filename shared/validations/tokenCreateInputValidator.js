const Validator = require('validatorjs');

exports.createTokenValidator = (createTokenReq) => {

    let rules = {
        userId: ['required', 'regex:^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$']
    };

    let validation = new Validator(createTokenReq, rules);
    validation.check();

    return validation;
}