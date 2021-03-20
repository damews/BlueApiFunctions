module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/CalibrationOverview');
    require('../shared/PlaySession');
    const CalibrationOverviewModel = mongoose.model('CalibrationOverview');
    const PlaySessionModel = mongoose.model('PlaySession');

    const authorizationUtils = require('../shared/authorization/tokenVerifier');
    const responseUtils = require('../shared/http/responseUtils');
    const errorMessages = require('../shared/http/errorMessages');
    const infoMessages = require('../shared/http/infoMessages');
    const inputValidator = require('../shared/validations/calibrationOverviewInputValidator');

    var isVerifiedGameToken = await authorizationUtils.verifyGameToken(req.headers.gametoken, mongoose);

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: responseUtils.createResponse(false, false, errorMessages.INVALID_TOKEN, null)
        }
        context.done();
        return;
    }

    const calibrationReq = req.body || {};

    if (Object.entries(calibrationReq).length === 0) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, true, errorMessages.EMPTY_REQUEST, null)
        }
        context.done();
        return;
    }

    let validationResult = inputValidator.calibrationOverviewSaveValidator(calibrationReq);
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

    calibrationReq._gameToken = req.headers.gametoken;

    try {

        const pacientSession = await PlaySessionModel.findOne({ pacientId: calibrationReq.pacientId }, null, { sort: { sessionNumber: -1 } });

        if (!pacientSession) {
            await new PlaySessionModel({ pacientId: calibrationReq.pacientId, sessionNumber: 1 }).save();
        } else {
            let pacientSessionDate = new Date(pacientSession.created_at);
            pacientSessionDate.setHours(0, 0, 0, 0);

            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (pacientSessionDate.getTime() != currentDate.getTime())
                await new PlaySessionModel({ pacientId: calibrationReq.pacientId, sessionNumber: pacientSession.sessionNumber + 1 }).save()
        }

        const savedCalibrationOverview = await (new CalibrationOverviewModel(calibrationReq)).save();
        context.log("[OUTPUT] - Calibration Overview Saved: ", savedCalibrationOverview);
        context.res = {
            status: 201,
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, savedCalibrationOverview)
        }
    } catch (err) {
        context.log("[DB SAVING] - ERROR: ", err);
        context.res = {
            status: 500,
            body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null)
        }
    }

    context.done();
};