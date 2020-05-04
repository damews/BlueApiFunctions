module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/GameToken');
    const GameTokenModel = mongoose.model('GameToken');

    const utils = require('../shared/utils');
    const { v4: uuidv4 } = require('uuid');

    const gameTokenReq = req.body || {};

    if(Object.entries(gameTokenReq).length === 0){
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

    gameTokenReq.token = uuidv4();

    try {
        const savedGameToken = await (new GameTokenModel(gameTokenReq)).save();
        context.log("[DB SAVING] - GameToken Saved: ", savedGameToken);
		context.res = {
            status: 201,
            body: utils.createResponse(true,
                true,
                "Game Token salvo com sucesso.",
                savedGameToken,
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