module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/MinigameOverview');
    require('../shared/FlowDataDevice');
    require('../shared/PlaySession');
    const MinigameOverviewModel = mongoose.model('MinigameOverview');
    const FlowDataDeviceModel = mongoose.model('FlowDataDevice');
    const PlaySessionModel = mongoose.model('PlaySession');

    const authorizationUtils = require('../shared/authorization/tokenVerifier');
    const responseUtils = require('../shared/http/responseUtils');
    const errorMessages = require('../shared/http/errorMessages');
    const infoMessages = require('../shared/http/infoMessages');
    const inputValidator = require('../shared/validations/minigameOverviewInputValidator');

    var isVerifiedGameToken = await authorizationUtils.verifyGameToken(req.headers.gametoken, mongoose);

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: responseUtils.createResponse(false, false, errorMessages.INVALID_TOKEN, null)
        }
        context.done();
        return;
    }

    const minigameOverviewReq = req.body || {};

    if (Object.entries(minigameOverviewReq).length === 0) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, true, errorMessages.EMPTY_REQUEST, null)
        }
        context.done();
        return;
    }

    let validationResult = inputValidator.minigameOverviewSaveValidator(minigameOverviewReq);
    if (validationResult.errorCount !== 0) {
        let response = responseUtils.createResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null);
        response.errors = validationResult.errors.errors;
        context.res = {
            status: 400,
            body: response
        }
        context.done();
        return;
    }

    minigameOverviewReq._gameToken = req.headers.gametoken;

    var flowDataDevicesIds = [];

    var flowDataDevicesObjects = minigameOverviewReq.flowDataRounds.map(x => x.flowDataDevices);

    var devices = flowDataDevicesObjects[0].map(x => x.deviceName);

    minigameOverviewReq.flowDataRounds.map(x => delete x.flowDataDevices);

    try {
        const saveFlowDataDevices = async () => {
            for (const flowDataDevices of flowDataDevicesObjects) {
                var savedFlowDataDevices = await (new FlowDataDeviceModel({ _gameToken: req.headers.gametoken, flowDataDevices: flowDataDevices })).save();
                flowDataDevicesIds.push(savedFlowDataDevices._id);
            }
        }

        await saveFlowDataDevices();

        minigameOverviewReq.flowDataRounds[0].flowDataDevicesId = flowDataDevicesIds[0];
        minigameOverviewReq.flowDataRounds[1].flowDataDevicesId = flowDataDevicesIds[1];
        minigameOverviewReq.flowDataRounds[2].flowDataDevicesId = flowDataDevicesIds[2];
        minigameOverviewReq.devices = devices;

        const pacientSession = await PlaySessionModel.findOne({ pacientId: minigameOverviewReq.pacientId }, null, { sort: { sessionNumber: -1 } });

        if (!pacientSession) {
            await new PlaySessionModel({ pacientId: minigameOverviewReq.pacientId, sessionNumber: 1 }).save();
        } else {
            let pacientSessionDate = new Date(pacientSession.created_at);
            pacientSessionDate.setHours(0, 0, 0, 0);

            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (pacientSessionDate.getTime() != currentDate.getTime())
                await new PlaySessionModel({ pacientId: minigameOverviewReq.pacientId, sessionNumber: pacientSession.sessionNumber + 1 }).save()
        }

        const savedMinigameOverview = await (new MinigameOverviewModel(minigameOverviewReq)).save();
        context.log("[OUTPUT] - MinigameOverview Saved: ", savedMinigameOverview);
        context.res = {
            status: 201,
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, savedMinigameOverview)
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null)
        }
    }

    context.done();
};