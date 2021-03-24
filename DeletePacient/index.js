module.exports = async function (context, req) {
  const { db } = require('../shared/Pacient');
  const mongoose = require('mongoose');
  const DATABASE = process.env.MongoDbAtlas;
  mongoose.connect(DATABASE);
  mongoose.Promise = global.Promise;

  // MinigameOverview Schema
  require('../shared/Pacient');
  require('../shared/PlataformOverview');
  require('../shared/CalibrationOverview');
  require('../shared/MinigameOverview');
  require('../shared/UserAccount');
  require('../shared/PlaySession');
  const PacientModel = mongoose.model('Pacient');
  const PlataformOverviewModel = mongoose.model('PlataformOverview');
  const CalibrationOverviewModel = mongoose.model('CalibrationOverview');
  const MinigameOverviewModel = mongoose.model('MinigameOverview');
  const UserAccountModel = mongoose.model('UserAccount');
  const PlaySessionModel = mongoose.model('PlaySession');

  const authorizationUtils = require('../shared/authorization/tokenVerifier');
  const responseUtils = require('../shared/http/responseUtils');
  const errorMessages = require('../shared/http/errorMessages');
  const infoMessages = require('../shared/http/infoMessages');

  const isVerifiedGameToken = await authorizationUtils.verifyGameToken(req.headers.gametoken, mongoose);

  if (!isVerifiedGameToken) {
    context.res = {
      status: 403,
      body: responseUtils.createResponse(false, false, errorMessages.INVALID_TOKEN, null),
    };
    context.done();
    return;
  }

  const isValidPacientId = /^[a-fA-F0-9]{24}$/.test(req.params.pacientId);
  if (!isValidPacientId) {
    context.res = {
      status: 404,
      body: responseUtils.createResponse(false, false, errorMessages.INVALID_REQUEST, null),
    };
    context.done();
    return;
  }

  let session = null;
  try {
    if (req.query.allData === '0') {
      const removedPacient = await PacientModel.deleteOne({ _id: req.params.pacientId });
      context.log('[DB DELETE] - Pacient Deleted: ', removedPacient);
    } else {
      return db.startSession()
        .then((_session) => {
          session = _session;
          session.startTransaction();
        })
        .then(async () => await PacientModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.pacientId) }).session(session))
        .then(async () => await PlataformOverviewModel.deleteMany({ pacientId: req.params.pacientId }).session(session))
        .then(async () => await CalibrationOverviewModel.deleteMany({ pacientId: req.params.pacientId }).session(session))
        .then(async () => await MinigameOverviewModel.deleteMany({ pacientId: req.params.pacientId }).session(session))
        .then(async () => await UserAccountModel.deleteOne({ pacientId: req.params.pacientId }).session(session))
        .then(async () => await PlaySessionModel.deleteOne({ pacientId: req.params.pacientId }).session(session))
        .then(async () => await session.commitTransaction())
        .then(async () => await session.endSession());
    }
    context.res = {
      status: 200,
      body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, null),
    };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    context.log('[DB DELETE] - ERROR: ', err);
    context.res = {
      status: 500,
      body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null),
    };
  }

  context.done();
};
