module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //CalibrationOverview Schema
    require('../shared/CalibrationOverview');
    const CalibrationOverviewModel = mongoose.model('CalibrationOverview');

    const utils = require('../shared/utils');

    await utils.validateHeaders(req.headers, context);

    var isVerifiedGameToken = await utils.verifyGameToken(req.headers.gametoken, mongoose);

    if(!isVerifiedGameToken){
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

    if (req.params.pacientId === undefined || req.params.pacientId == null) {
        context.res = {
            status: 400,
            body: utils.createResponse(false,
                false,
                "Parâmetros de consulta inexistentes.",
                null,
                300)
        }
        context.done();
        return;
    }

    const findObj = {
        pacientId: req.params.pacientId,
        _gameToken: req.headers.gametoken
    }

    if (req.query.gameDevice)
        findObj.gameDevice = req.query.gameDevice;
    if (req.query.calibrationExercise)
        findObj.calibrationExercise = req.query.calibrationExercise;

    try {
        const calibrationOverviews = await CalibrationOverviewModel.find(findObj);
        context.log("[DB QUERYING] - CalibrationOverview Get");
        context.res = {
            status: 200,
            body: utils.createResponse(true,
                true,
                "Consulta realizada com sucesso.",
                calibrationOverviews,
                null)
        }
    } catch (err) {
        context.log("[DB QUERYING] - ERROR: ", err);
        context.res = {
            status: 500,
            body: utils.createResponse(false,
                true,
                "Ocorreu um erro interno ao realizar a operação.",
                null,
                00)
        }
    }

    context.done();
};



