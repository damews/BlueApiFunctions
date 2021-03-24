module.exports = async function (context, req) {
  const mongoose = require('mongoose');
  const DATABASE = process.env.MongoDbAtlas;
  mongoose.connect(DATABASE);
  mongoose.Promise = global.Promise;

  // PlataformOverview Schema
  require('../shared/PlataformOverview');
  require('../shared/FlowDataDevice');
  require('../shared/PlaySession');

  const PlataformOverviewModel = mongoose.model('PlataformOverview');
  const FlowDataDeviceModel = mongoose.model('FlowDataDevice');
  const PlaySessionModel = mongoose.model('PlaySession');

  const authorizationUtils = require('../shared/authorization/tokenVerifier');
  const responseUtils = require('../shared/http/responseUtils');
  const errorMessages = require('../shared/http/errorMessages');
  const infoMessages = require('../shared/http/infoMessages');
  const inputValidator = require('../shared/validations/plataformOverviewInputValidator');

  const isVerifiedGameToken = await authorizationUtils.verifyGameToken(req.headers.gametoken, mongoose);

  if (!isVerifiedGameToken) {
    context.res = {
      status: 403,
      body: responseUtils.createResponse(false, false, errorMessages.INVALID_TOKEN, null),
    };
    context.done();
    return;
  }

  const plataformOverviewReq = req.body || {};

  if (Object.entries(plataformOverviewReq).length === 0) {
    context.res = {
      status: 400,
      body: responseUtils.createResponse(false, true, errorMessages.EMPTY_REQUEST, null),
    };
    context.done();
    return;
  }

  const validationResult = inputValidator.plataformOverviewSaveValidator(plataformOverviewReq);
  if (validationResult.errorCount !== 0) {
    const response = responseUtils.createResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null);
    response.errors = validationResult.errors.errors;
    context.res = {
      status: 400,
      body: response,
    };
    context.done();
    return;
  }

  plataformOverviewReq._gameToken = req.headers.gametoken;

  const flowDataDevicesReq = req.body.flowDataDevices;

  plataformOverviewReq.devices = flowDataDevicesReq.map((x) => x.deviceName);

  // BUSCAR OS MAIORES VALORES
  plataformOverviewReq.flowDataDevicesValues = flowDataDevicesReq.map((element) => ({
    deviceName: element.deviceName,
    maxFlowValue: element.flowData.reduce((max, el) => (el.flowValue > max ? el.flowValue : max), element.flowData[0].flowValue),
    minFlowValue: element.flowData.reduce((min, el) => (el.flowValue < min ? el.flowValue : min), element.flowData[0].flowValue),
    meanFlowValue: element.flowData.reduce((acc, value) => (acc + Number.parseFloat(value.flowValue)), 0) / element.flowData.length,
  }));

  delete plataformOverviewReq.flowDataDevices;

  try {
    const pacientSession = await PlaySessionModel.findOne({ pacientId: plataformOverviewReq.pacientId }, null, { sort: { sessionNumber: -1 } });

    if (!pacientSession) {
      await new PlaySessionModel({ pacientId: plataformOverviewReq.pacientId, sessionNumber: 1 }).save();
    } else {
      const pacientSessionDate = new Date(pacientSession.created_at);
      pacientSessionDate.setHours(0, 0, 0, 0);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (pacientSessionDate.getTime() != currentDate.getTime()) { await new PlaySessionModel({ pacientId: plataformOverviewReq.pacientId, sessionNumber: pacientSession.sessionNumber + 1 }).save(); }
    }

    const savedFlowDataDevices = await (new FlowDataDeviceModel({ _gameToken: req.headers.gametoken, flowDataDevices: flowDataDevicesReq })).save();
    plataformOverviewReq.flowDataDevicesId = savedFlowDataDevices._id;
    const savedPlataformOverview = await (new PlataformOverviewModel(plataformOverviewReq)).save();
    context.log('[OUTPUT] - PlataformOverview Saved: ', savedPlataformOverview);
    context.res = {
      status: 201,
      body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, savedPlataformOverview, null),
    };
  } catch (err) {
    context.log('[DB SAVING] - ERROR: ', err);
    context.res = {
      status: 500,
      body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null),
    };
  }

  context.done();
};
