const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const PlataformOverviewService = require('../shared/services/plataformOverviewService');

const mongoose = require('../shared/database/mongoDatabase');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

require('../shared/database/models/plataformOverview');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[GetPlataformOverviewStatistics] Function has been called! - ${context.invocationId}`);

  if (!req.headers['game-token']) {
    context.log.info(`Empty gameToken header. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 403,
      body: createBaseResponse(false, false, errorMessages.GAMETOKEN_HEADER_NOT_FOUND, null),
    };
    context.done();
    return;
  }

  try {
    const mongoClient = await mongoose.connect(process.env.MONGO_CONNECTION, context);

    const plataformOverviewRepository = new MongooseRepository(mongoClient.model('PlataformOverview'));
    const plataformOverviewService = (
      new PlataformOverviewService({ plataformOverviewRepository, context })
    );

    context.log.info('Getting PlataformOverviewStatistics Results...');

    const results = (
      await plataformOverviewService
        .getPlataformOverviewStatistics(
          req.query,
        )
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
