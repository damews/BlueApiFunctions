module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/Pacient');
    const PacientModel = mongoose.model('Pacient');

    const authorizationUtils = require('../shared/authorization/tokenVerifier');
    const responseUtils = require('../shared/http/responseUtils');
    const errorMessages = require('../shared/http/errorMessages');
    const infoMessages = require('../shared/http/infoMessages');
    const inputValidator = require('../shared/validations/pacientInputValidator');

    var isVerifiedGameToken = await authorizationUtils.verifyGameToken(req.headers.gametoken, mongoose);

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: responseUtils.createResponse(false, false, errorMessages.INVALID_TOKEN, null)
        }
        context.done();
        return;
    }

    const pacientReq = req.body || {};

    if (Object.entries(pacientReq).length === 0) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, true, errorMessages.EMPTY_REQUEST, null)
        }
        context.done();
        return;
    }

    let validationResult = inputValidator.pacientSaveValidator(pacientReq);
    if (validationResult.errorCount !== 0) {
        let response = responseUtils.createResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null, 2);
        response.errors = validationResult.errors.errors;
        context.res = {
            status: 400,
            body: response
        }
        context.done();
        return;
    }

    pacientReq._gameToken = req.headers.gametoken;
    pacientReq.birthday = new Date(`${req.body.birthday} 00:00:00:000`);

    try {
        const savedPacient = await (new PacientModel(pacientReq)).save();
        context.log("[DB SAVING] - Pacient Saved: ", savedPacient);
        context.res = {
            status: 201,
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, savedPacient)
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