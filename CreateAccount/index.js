module.exports = async function (context, req) {
    const inputValidator = require('../shared/validations/accountCreateInputValidator');
    const responseUtils = require('../shared/http/responseUtils');
    const errorMessages = require('../shared/constants/errorMessages');
    const infoMessages = require('../shared/constants/infoMessages');

    const mongoose = require('../shared/database/mongoDatabase');
    const accountService = require('../shared/services/accountService');
    const mongooseRepository = require('../shared/database/repositories/mongooseRepository');

    require('../shared/database/models/userAccount');

    context.log.info("[CreateAccount] Function has been called! - " + context.invocationId);

    const userAccountReq = req.body || {};

    if (Object.entries(userAccountReq).length === 0) {

        context.log.info("Empty body request. InvocationId: " + context.invocationId);

        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, false, errorMessages.EMPTY_REQUEST, null)
        }
        context.done();
        return;

    }

    let validationResult = inputValidator.createUserValidator(userAccountReq);

    if (validationResult.errorCount !== 0) {

        context.log.info("Validation failed on account creation. InvocationId: " + context.invocationId);

        let response = responseUtils.createResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null);
        response.errors = validationResult.errors.errors;

        context.res = {
            status: 400,
            body: response
        }
        context.done();
        return;
    }

    context.log.info("Request body validated. InvocationId: " + context.invocationId);

    try {

        const mongoClient = await mongoose.connect(process.env.MONGO_CONNECTION, context);

        const service = new accountService(new mongooseRepository(mongoClient.model('UserAccount')), context);

        context.log.info("Creating Account...");

        let result = await service.create(userAccountReq);

        if (result.error) {

            context.log.info("Error on creating Account: " + result.error, "InvocationId: " + context.invocationId);

            context.res = {
                status: 400,
                body: responseUtils.createResponse(true, false, result.error, null)
            }
            context.done();
            return;

        }

        context.log.info("Success on account creation: \n", result);

        context.res = {
            status: 201,
            body: responseUtils.createResponse(true, false, infoMessages.SUCCESSFULLY_REGISTERED, result)
        }

    } catch (err) {

        context.log.error("An unexpected error has happened. InvocationId: " + context.invocationId);

        context.res = {
            status: 500,
            body: responseUtils.createResponse(false, false, errorMessages.DEFAULT_ERROR, null)
        }

    }
};