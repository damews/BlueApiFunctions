module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //CalibrationOverview Schema
    require('../shared/CalibrationOverview');
    const CalibrationOverviewModel = mongoose.model('CalibrationOverview');

    const utils = require('../shared/utils');

    var isVerifiedGameToken = await utils.verifyGameToken(req.headers.gametoken, mongoose);

    if(!isVerifiedGameToken){
        context.res = {
            status: 403,
            body: "Token do jogo inexistente."
        }
        context.done();
        return;
    }

    const findObj = {}

    if (req.query.pacientId === undefined || req.query.pacientId == null) {
        context.res = {
            status: 400,
            body: "ID do paciente necessário!"
        }
        context.done();
        return;
    }

    findObj.pacientId = req.query.pacientId;

    if (req.query.gameDevice)
        findObj.gameDevice = req.query.gameDevice;
    if (req.query.calibrationExercise)
        findObj.calibrationExercise = req.query.calibrationExercise;

    try {
        const calibrationOverviews = await CalibrationOverviewModel.find(findObj);
        context.log("[OUTPUT] - CalibrationOverview Get");
        context.res = {
            status: 200,
            body: calibrationOverviews
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        }
    }

    context.done();
};



