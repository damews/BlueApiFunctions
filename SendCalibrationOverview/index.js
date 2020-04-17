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

    if(!isVerifiedGameToken){
        context.res = {
            status: 403,
            body: "Token do jogo inexistente."
        }
        context.done();
        return;
    }
    
    const calibrationReq = req.body || {};

    if(Object.entries(calibrationReq).length === 0){
        context.res = {
            status: 400,
            body: "Calibração necessária!"
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
            body: savedCalibrationOverview
        }
	} catch (err) {
		context.res = {
            status: 500,
            body: err
        }
    }
    
    context.done();
};