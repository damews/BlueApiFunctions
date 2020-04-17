module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/Pacient');
    const PacientModel = mongoose.model('Pacient');

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
    
    const pacientReq = req.body || {};

    if(Object.entries(pacientReq).length === 0){
        context.res = {
            status: 400,
            body: "Paciente necessário!"
        }
        context.done();
        return;
    }

    pacientReq._gameToken = req.headers.gametoken;

    try {
        const savedPacient = await (new PacientModel(pacientReq)).save();
        context.log("[OUTPUT] - Pacient Saved: ", savedPacient);
		context.res = {
            status: 201,
            body: savedPacient
        }
	} catch (err) {
		context.res = {
            status: 500,
            body: err
        }
    }
    
    context.done();
};