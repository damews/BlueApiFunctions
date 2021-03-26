const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const PacientService = require('../shared/services/pacientService');

const PlataformOverviewService = require('../shared/services/plataformOverviewService');

const PlaySessionService = require('../shared/services/playSessionService');

const MinigameOverviewService = require('../shared/services/minigameOverviewService');

const CalibrationOverviewService = require('../shared/services/calibrationOverviewService');

const UserAccountService = require('../shared/services/accountService');

const GameTokenService = require('../shared/services/gameTokenService');

const mongoose = require('../shared/database/mongoDatabase');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

require('../shared/database/models/pacient');

require('../shared/database/models/plataformOverview');

require('../shared/database/models/calibrationOverview');

require('../shared/database/models/minigameOverview');

require('../shared/database/models/userAccount');

require('../shared/database/models/playSession');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[DeletePacient] Function has been called! - ${context.invocationId}`);

  if (!req.headers['game-token']) {
    context.log.info(`Empty gameToken header. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 403,
      body: createBaseResponse(false, false, errorMessages.GAMETOKEN_HEADER_NOT_FOUND, null),
    };
    context.done();
    return;
  }

  const isValidPacientId = /^[a-fA-F0-9]{24}$/.test(req.params.pacientId);
  if (!isValidPacientId) {
    context.res = {
      status: 404,
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

    context.log.info('Deleting Pacient Data...');

    // await calibrationOverviewService.deleteManyByPacientId(req.params.pacientId);
    // const b = mongoClient.model('CalibrationOverview');
    // await b.deleteMany({ pacientId: req.params.pacientId });
    Promise.all([
      pacientService.delete(req.params.pacientId),
      plataformOverviewService.deleteManyByPacientId(req.params.pacientId),
      calibrationOverviewService.deleteManyByPacientId(req.params.pacientId),
      minigameOverviewService.deleteManyByPacientId(req.params.pacientId),
      userAccountService.deletebyPacientId(req.params.pacientId),
      playSessionService.deleteManyByPacientId(req.params.pacientId),
    ]).then(() => {
      context.log.info('Pacient Data Deleted...');
    });

    context.res = {
      status: 200,
      body: createBaseResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, null),
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
