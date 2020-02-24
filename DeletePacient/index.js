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
    
    if(req.params.pacientId === undefined || req.params.pacientId == null){
        context.res = {
            status: 404,
            body: "ID do Paciente necessário!"
        }
        context.done();
        return;
    }

    try {
        const removedPacient = await PacientModel.deleteOne({_id: req.params.pacientId});
        context.log("[OUTPUT] - Pacient Deleted: ", removedPacient);
		context.res = {
            status: 204,
        }
	} catch (err) {
		context.res = {
            status: 500,
            body: err
        }
    }
    
    context.done();
};