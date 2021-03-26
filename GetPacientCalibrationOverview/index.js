const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const GameTokenService = require('../shared/services/gameTokenService');

const CalibrationOverviewService = require('../shared/services/calibrationOverviewService');

const mongoose = require('../shared/database/mongoDatabase');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

require('../shared/database/models/userAccount');
require('../shared/database/models/calibrationOverview');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[GetPacientCalibrationOverview] Function has been called! - ${context.invocationId}`);

  if (!req.headers['game-token']) {
    context.log.info(`Empty gameToken header. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 403,
      body: createBaseResponse(false, false, errorMessages.GAMETOKEN_HEADER_NOT_FOUND, null),
    };
    context.done();
    return;
  }

  if (req.params.pacientId === undefined || req.params.pacientId == null) {
    context.log.info(`Must provide pacientId parameter. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 400,
      body: createBaseResponse(false, false, errorMessages.INVALID_REQUEST, null),
    };
    context.done();
    return;
  }

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

    const calibrationOverviewRepository = new MongooseRepository(mongoClient.model('CalibrationOverview'));
    const calibrationOverviewService = (
      new CalibrationOverviewService({ calibrationOverviewRepository, context })
    );

    context.log.info('Getting PacientCalibrationOverview Results...');

    const results = (
      await calibrationOverviewService
        .getPacientCalibrationOverview(req.query, req.params.pacientId, req.headers['game-token'])
    );

    context.res = {
      status: 200,
      body: createBaseResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, results),
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
