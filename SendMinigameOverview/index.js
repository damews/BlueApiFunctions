const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const GameTokenService = require('../shared/services/gameTokenService');

const MinigameOverviewService = require('../shared/services/minigameOverviewService');

const mongoose = require('../shared/database/mongoDatabase');

const inputValidator = require('../shared/validations/minigameOverviewInputValidator');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

require('../shared/database/models/userAccount');
require('../shared/database/models/minigameOverview');
require('../shared/database/models/flowDataDevice');
require('../shared/database/models/playSession');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[SendMinigamenOverview] Function has been called! - ${context.invocationId}`);

  const minigameOverviewReq = req.body || {};

  if (Object.entries(minigameOverviewReq).length === 0) {
    context.log.info(`Empty body request. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 400,
      body: createBaseResponse(false, false, errorMessages.EMPTY_REQUEST, null),
    };
    context.done();
    return;
  }

  const validationResult = inputValidator.minigameOverviewSaveValidator(minigameOverviewReq);

  if (validationResult.errorCount !== 0) {
    context.log.info(`Validation failed on account creation. InvocationId: ${context.invocationId}`);

    const response = createBaseResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null);
    response.errors = validationResult.errors.errors;

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

    const userAccountRepository = new MongooseRepository(mongoClient.model('UserAccount'));
    const gameTokenService = new GameTokenService(userAccountRepository, context);

    context.log.info('Validating Token Account...');

    const isValidated = gameTokenService.validate(req.headers['game-token']);
    if (!isValidated) {
      context.log(`Game Token is invalid. InvocationId: ${context.invocationId}`);

      context.res = {
        status: 403,
        body: createBaseResponse(false, false, errorMessages.INVALID_TOKEN, null),
      };
      context.done();
      return;
    }

    const minigameOverviewRepository = new MongooseRepository(mongoClient.model('MinigameOverview'));
    const flowDataDeviceRepository = new MongooseRepository(mongoClient.model('FlowDataDevice'));
    const playSessionRepository = new MongooseRepository(mongoClient.model('PlaySession'));
    const minigameOverviewService = new MinigameOverviewService({
      minigameOverviewRepository, flowDataDeviceRepository, playSessionRepository, context,
    });

    const result = await minigameOverviewService.create(minigameOverviewReq, req.headers['game-token']);

    context.log.info('Success on MinigameOverview creation: \n', result);

    context.res = {
      status: 201,
      body: createBaseResponse(true, false, infoMessages.SUCCESSFULLY_REQUEST, result),
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
