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
    
    if(req.params.pacientId === undefined || req.params.pacientId == null){
        context.res = {
            status: 404,
            body: utils.createResponse(false,
                false,
                "Parâmetros de consulta inexistentes.",
                null,
                300)
        }
        context.done();
        return;
    }

    try {
        const removedPacient = await PacientModel.deleteOne({_id: req.params.pacientId});
        context.log("[DB DELETE] - Pacient Deleted: ", removedPacient);
		context.res = {
            status: 204,
            body: utils.createResponse(true,
                true,
                "Exclusão realizada com sucesso.",
                null,
                null)
        }
	} catch (err) {
        context.log("[DB DELETE] - ERROR: ", err);
		context.res = {
            status: 500,
            body: err
        }
    }
    
    context.done();
};