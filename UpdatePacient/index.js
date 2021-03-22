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

    if (req.params.pacientId === undefined || req.params.pacientId == null) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, false, errorMessages.INVALID_REQUEST, null)
        }
        context.done();
        return;
    }

    let validationResult = inputValidator.pacientSaveValidator(pacientReq);
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

    pacientReq._gameToken = req.headers.gametoken;

    try {
        const updatedPacient = await PacientModel.updateOne(
            { _id: req.params.pacientId, _gameToken: req.headers.gametoken },
            {
                $set:
                {
                    name: req.body.name,
                    sex: req.body.sex,
                    birthday: req.body.birthday,
                    capacitiesPitaco: {
                        insPeakFlow: req.body.capacitiesPitaco.insPeakFlow,
                        expPeakFlow: req.body.capacitiesPitaco.expPeakFlow,
                        insFlowDuration: req.body.capacitiesPitaco.insFlowDuration,
                        expFlowDuration: req.body.capacitiesPitaco.expFlowDuration,
                        respiratoryRate: req.body.capacitiesPitaco.respiratoryRate,
                    },
                    capacitiesMano: {
                        insPeakFlow: req.body.capacitiesMano.insPeakFlow,
                        expPeakFlow: req.body.capacitiesMano.expPeakFlow,
                        insFlowDuration: req.body.capacitiesMano.insFlowDuration,
                        expFlowDuration: req.body.capacitiesMano.expFlowDuration,
                        respiratoryRate: req.body.capacitiesMano.respiratoryRate,
                    },
                    capacitiesCinta: {
                        insPeakFlow: req.body.capacitiesCinta.insPeakFlow,
                        expPeakFlow: req.body.capacitiesCinta.expPeakFlow,
                        insFlowDuration: req.body.capacitiesCinta.insFlowDuration,
                        expFlowDuration: req.body.capacitiesCinta.expFlowDuration,
                        respiratoryRate: req.body.capacitiesCinta.respiratoryRate,
                    },
                    observations: req.body.observations,
                    condition: req.body.condition,
                    unlockedLevels: req.body.unlockedLevels,
                    playSessionsDone: req.body.playSessionsDone,
                    calibrationPitacoDone: req.body.calibrationPitacoDone,
                    calibrationManoDone: req.body.calibrationManoDone,
                    calibrationCintaDone: req.body.calibrationCintaDone,
                    howToPlayDone: req.body.howToPlayDone,
                    weight: req.body.weigth,
                    height: req.body.heigth,
                    pitacoThreshold: req.body.pitacoThreshold,
                    manoThreshold: req.body.manoThreshold,
                    cintaThreshold: req.body.cintaThreshold,
                    ethnicity: req.body.ethnicity,
                }
            });
        context.log("[DB UPDATE] - Pacient Updated: ", updatedPacient);
        context.res = {
            status: 200,
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, updatedPacient)
        }
    } catch (err) {
        context.log("[DB DELETE] - ERROR: ", err);
        context.res = {
            status: 500,
            body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null)
        }
    }

    context.done();
};