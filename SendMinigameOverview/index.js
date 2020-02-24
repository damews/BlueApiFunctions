module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/MinigameOverview');
    const MinigameOverviewModel = mongoose.model('MinigameOverview');

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
    
    const minigameOverviewReq = req.body || {};

    if(Object.entries(minigameOverviewReq).length === 0){
        context.res = {
            status: 400,
            body: "Resumo do Minigame necessário!"
        }
        context.done();
        return;
    }

    try {
        const savedMinigameOverview = await (new MinigameOverviewModel(minigameOverviewReq)).save();
        context.log("[OUTPUT] - MinigameOverview Saved: ", savedMinigameOverview);
		context.res = {
            status: 201,
            body: savedMinigameOverview
        }
	} catch (err) {
		context.res = {
            status: 500,
            body: err
        }
    }
    
    context.done();
};