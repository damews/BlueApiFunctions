const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const UserAccountService = require('../shared/services/accountService');

const PacientService = require('../shared/services/pacientService');

const PlataformOverviewService = require('../shared/services/plataformOverviewService');

const PlaySessionService = require('../shared/services/playSessionService');

const MinigameOverviewService = require('../shared/services/minigameOverviewService');

const CalibrationOverviewService = require('../shared/services/calibrationOverviewService');

const FlowDataDeviceService = require('../shared/services/flowDataDeviceService');

const GameTokenService = require('../shared/services/gameTokenService');

const mongoose = require('../shared/database/mongoDatabase');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

require('../shared/database/models/userAccount');

require('../shared/database/models/pacient');

require('../shared/database/models/plataformOverview');

require('../shared/database/models/calibrationOverview');

require('../shared/database/models/minigameOverview');

require('../shared/database/models/userAccount');

require('../shared/database/models/playSession');

require('../shared/database/models/flowDataDevice');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[DeleteAccount] Function has been called! - ${context.invocationId}`);

  if (!req.headers['game-token']) {
    context.log.info(`Empty gameToken header. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 403,
      body: createBaseResponse(false, false, errorMessages.GAMETOKEN_HEADER_NOT_FOUND, null),
    };
    context.done();
    return;
  }

  const isValidUserAccountId = /^[a-fA-F0-9]{24}$/.test(req.params.userAccountId);
  if (!isValidUserAccountId) {
    context.res = {
      status: 400,
      body: createBaseResponse(false, false, errorMessages.INVALID_REQUEST, null),
    };
    context.done();
    return;
  }

  try {
    const mongoClient = await mongoose.connect(process.env.MONGO_CONNECTION, context);

    const pacientRepository = new MongooseRepository(mongoClient.model('Pacient'));
    const plataformOverviewRepository = new MongooseRepository(mongoClient.model('PlataformOverview'));
    const calibrationOverviewRepository = new MongooseRepository(mongoClient.model('CalibrationOverview'));
    const minigameOverviewRepository = new MongooseRepository(mongoClient.model('MinigameOverview'));
    const userAccountRepository = new MongooseRepository(mongoClient.model('UserAccount'));
    const playSessionRepository = new MongooseRepository(mongoClient.model('PlaySession'));
    const flowDataDeviceRepository = new MongooseRepository(mongoClient.model('FlowDataDevice'));

    const gameTokenService = new GameTokenService(userAccountRepository, context);
    const userAccountService = new UserAccountService(userAccountRepository, context);
    const pacientService = new PacientService({ pacientRepository, context });
    const plataformOverviewService = new PlataformOverviewService(
      { plataformOverviewRepository, context },
    );
    const calibrationOverviewService = new CalibrationOverviewService(
      { calibrationOverviewRepository, context },
    );
    const minigameOverviewService = new MinigameOverviewService(
      { minigameOverviewRepository, context },
    );
    const playSessionService = new PlaySessionService({ playSessionRepository, context });
    const flowDataDeviceService = new FlowDataDeviceService(flowDataDeviceRepository, context);

    context.log.info('Validating Token Account...');

    const isValidated = await gameTokenService.validate(req.headers['game-token']);
    if (!isValidated) {
      context.log(`Game Token is invalid. InvocationId: ${context.invocationId}`);

      context.res = {
        status: 403,
        body: createBaseResponse(false, false, errorMessages.INVALID_TOKEN, null),
      };
      context.done();
      return;
    }

    context.log.info('Deleting all data by game token...');

    Promise.all([
      pacientService.deleteManyByGameToken(req.headers['game-token']),
      plataformOverviewService.deleteManyByGameToken(req.headers['game-token']),
      calibrationOverviewService.deleteManyByGameToken(req.headers['game-token']),
      minigameOverviewService.deleteManyByGameToken(req.headers['game-token']),
      userAccountService.deletebyUserAccounId(req.params.userAccountId),
      playSessionService.deleteManyByGameToken(req.headers['game-token']),
      flowDataDeviceService.deleteManyByGameToken(req.headers['game-token']),
    ]).then(() => {
      context.log.info('All data is now deleted...');
    });

    context.res = {
      status: 200,
      body: createBaseResponse(true, false, infoMessages.SUCCESSFULLY_REQUEST, null),
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
