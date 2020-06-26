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
            body: utils.createResponse(false,
                false,
                "Chave de acesso inválida.",
                null,
                1)
        }
        context.done();
        return;
    }
    
    const pacientReq = req.body || {};

    if(Object.entries(pacientReq).length === 0){
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

    pacientReq._gameToken = req.headers.gametoken;
    pacientReq.birthday = new Date(`${req.body.birthday} 00:00:00:000`);

    try {
        const savedPacient = await (new PacientModel(pacientReq)).save();
        context.log("[DB SAVING] - Pacient Saved: ", savedPacient);
		context.res = {
            status: 201,
            body: utils.createResponse(true,
                true,
                "Paciente salvo com sucesso.",
                savedPacient,
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