const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const mongoose = require('../shared/database/mongoDatabase');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

const GameTokenService = require('../shared/services/gameTokenService');

const inputValidator = require('../shared/validations/tokenCreateInputValidator');

require('../shared/database/models/userAccount');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[CreateGameToken] Function has been called! - ${context.invocationId}`);

  const gameTokenReq = req.body || {};

  if (Object.entries(gameTokenReq).length === 0) {
    context.log.info(`Empty body request. InvocationId: ${context.invocationId}`);
    context.res = {
      status: 400,
      body: createBaseResponse(false, true, errorMessages.EMPTY_REQUEST, null),
    };
    context.done();

    return;
  }

  const validationResult = inputValidator.createTokenValidator(gameTokenReq);

  if (validationResult.errorCount !== 0) {
    context.log.info(`Validation failed on game token creation. InvocationId: ${context.invocationId}`);

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
    const service = new GameTokenService(repository, context);

    context.log.info('Creating Game Token...');

    const result = await service.create(gameTokenReq);

    if (result.error) {
      context.log.info(`Error on creating Game Token: ${result.error}`, `InvocationId: ${context.invocationId}`);

      context.res = {
        status: 400,
        body: createBaseResponse(true, false, result.error, null),
      };
      context.done();
      return;
    }

    context.log.info('Success on game token creation: \n', result);

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

  context.done();
};
