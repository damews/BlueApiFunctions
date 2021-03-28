const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const mongoose = require('../shared/database/mongoDatabase');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

const AccountService = require('../shared/services/accountService');

const inputValidator = require('../shared/validations/accountCreateInputValidator');

require('../shared/database/models/userAccount');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[CreateAccount] Function has been called! - ${context.invocationId}`);

  const userAccountReq = req.body || {};

  if (Object.entries(userAccountReq).length === 0) {
    context.log.info(`Empty body request. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 400,
      body: createBaseResponse(false, false, errorMessages.EMPTY_REQUEST, null),
    };
    context.done();
    return;
  }

  const validationResult = inputValidator.createUserValidator(userAccountReq);

  if (validationResult.errorCount !== 0) {
    context.log.info(`Validation failed on account creation. InvocationId: ${context.invocationId}`);

    const response = createBaseResponse(
      false, true, errorMessages.VALIDATION_ERROR_FOUND, validationResult.errors.errors,
    );

    context.res = {
      status: 400,
      body: response,
    };
    context.done();
    return;
  }

  context.log.info(`Request body validated. InvocationId: ${context.invocationId}`);

  try {
    const mongoClient = await mongoose.connect(process.env.MONGO_CONNECTION, context);

    const repository = new MongooseRepository(mongoClient.model('UserAccount'));
    const service = new AccountService(repository, context);

    context.log.info('Creating Account...');

    const result = await service.create(userAccountReq);

    if (result.error) {
      context.log.info(`Error on creating Account: ${result.error}`, `InvocationId: ${context.invocationId}`);

      context.res = {
        status: 400,
        body: createBaseResponse(true, false, result.error, null),
      };
      context.done();
      return;
    }

    context.log.info('Success on account creation: \n', result);

    context.res = {
      status: 201,
      body: createBaseResponse(true, true, infoMessages.SUCCESSFULLY_REGISTERED, result),
    };
  } catch (err) {
    context.log.error(`An unexpected error has happened. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 500,
      body: createBaseResponse(false, false, errorMessages.DEFAULT_ERROR, null),
    };
  }
};
