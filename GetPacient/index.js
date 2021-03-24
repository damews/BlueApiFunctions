module.exports = async function (context, req) {
  const mongoose = require('mongoose');
  const DATABASE = process.env.MongoDbAtlas;
  mongoose.connect(DATABASE);
  mongoose.Promise = global.Promise;

  // PlataformOverview Schema
  require('../shared/Pacient');
  const PacientModel = mongoose.model('Pacient');

  const authorizationUtils = require('../shared/authorization/tokenVerifier');
  const responseUtils = require('../shared/http/responseUtils');
  const errorMessages = require('../shared/http/errorMessages');
  const infoMessages = require('../shared/http/infoMessages');

  const isVerifiedGameToken = await authorizationUtils.verifyGameToken(req.headers.gametoken, mongoose);

  if (!isVerifiedGameToken) {
    context.res = {
      status: 403,
      body: responseUtils.createResponse(false, false, errorMessages.INVALID_TOKEN, null, 1),
    };
    context.done();
    return;
  }

  if (req.params.pacientId === undefined || req.params.pacientId == null) {
    context.res = {
      status: 400,
      body: responseUtils.createResponse(false, false, errorMessages.INVALID_REQUEST, null, 300),
    };
    context.done();
    return;
  }

  const aggregate = PacientModel.aggregate();
  aggregate.match({ _id: mongoose.Types.ObjectId(req.params.pacientId), _gameToken: req.headers.gametoken });

  aggregate.lookup({
    from: 'playsessions',
    let: { pacientId: '$_id' },
    pipeline:
            [
              { $addFields: { pacientId: { $toObjectId: '$pacientId' } } },
              { $match: { $expr: { $eq: ['$pacientId', '$$pacientId'] } } },
            ],
    as: 'playSessions',
  });

  try {
    const pacients = await aggregate.exec();
    context.log('[DB QUERYING] - Pacient Get by ID');
    context.res = {
      status: 200,
      body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, pacients[0]),
    };
  } catch (err) {
    context.log('[DB QUERYING] - ERROR: ', err);
    context.res = {
      status: 500,
      body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null),
    };
  }

  context.done();
};
