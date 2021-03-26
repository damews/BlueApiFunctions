const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const AuthenticationService = require('../shared/services/authenticationService');

const mongoose = require('../shared/database/mongoDatabase');

const inputValidator = require('../shared/validations/authenticateInputValidator');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

require('../shared/database/models/userAccount');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[LoginAccount] Function has been called! - ${context.invocationId}`);

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

  const validationResult = inputValidator.authenticateValidator(userAccountReq);
  if (validationResult.errorCount !== 0) {
    context.log.info(`Validation failed on authentication creation. InvocationId: ${context.invocationId}`);

    const response = createBaseResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null);
    response.errors = validationResult.errors.errors;

    context.res = {
      status: 400,
      body: response,
    };
    context.done();
    return;
  }

  try {
    const mongoClient = await mongoose.connect(process.env.MONGO_CONNECTION, context);

    const userAccountRepository = new MongooseRepository(mongoClient.model('UserAccount'));
    const authenticationService = new AuthenticationService({ userAccountRepository, context });

    context.log.info('Authenticating...');

    const result = await authenticationService.authenticate(
      userAccountReq.username,
      userAccountReq.password,
    );

    if (result.error) {
      context.log.info(`Error on authenticate: ${result.error}`, `InvocationId: ${context.invocationId}`);

      context.res = {
        status: 400,
        body: createBaseResponse(true, false, result.error, null),
      };
      context.done();
      return;
    }

    context.log.info('Success to authenticate: \n', result);

    context.res = {
      status: 201,
      body: createBaseResponse(true, false, infoMessages.SUCCESSFULLY_AUTHENTICATION, result),
    };
  } catch (err) {
    context.log(`An unexpected error has happened. InvocationId: ${context.invocationId}`);
    context.res = {
      status: 500,
      body: createBaseResponse(false, true, errorMessages.DEFAULT_ERROR, null),
    };
  }
  context.done();
};
