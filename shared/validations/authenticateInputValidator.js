const Validator = require('validatorjs');

exports.authenticateValidator = (authenticateReq) => {

    let rules = {
        username: 'required|string',
        password: 'required|string'
    };

    let validation = new Validator(authenticateReq, rules);
    validation.check();

    return validation;
}
