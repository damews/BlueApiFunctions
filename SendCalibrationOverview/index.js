module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/CalibrationOverview');
    const CalibrationOverviewModel = mongoose.model('CalibrationOverview');

    const utils = require('../shared/utils');

    var isVerifiedGameToken = await utils.verifyGameToken(req.headers.gametoken, mongoose);

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: utils.createResponse(false,
                false,
                "Chave de acesso inválida.",
                null,
                1)
        }
        context.done();
        return;
    }

    const calibrationReq = req.body || {};

    if (Object.entries(calibrationReq).length === 0) {
        context.res = {
            status: 400,
            body: utils.createResponse(false,
                true,
                "Dados vazios!",
                null,
                2)
        }
        context.done();
        return;
    }

    calibrationReq._gameToken = req.headers.gametoken;

    try {
        const savedCalibrationOverview = await (new CalibrationOverviewModel(calibrationReq)).save();
        context.log("[OUTPUT] - Calibration Overview Saved: ", savedCalibrationOverview);
        context.res = {
            status: 201,
            body: utils.createResponse(true,
                true,
                "Calibração salva com sucesso.",
                savedCalibrationOverview,
                null)
        }
    } catch (err) {
        context.log("[DB SAVING] - ERROR: ", err);
        context.res = {
            status: 500,
            body:  utils.createResponse(false,
                true,
                "Ocorreu um erro interno ao realizar a operação.",
                null,
                00)
        }
    }

    context.done();
};