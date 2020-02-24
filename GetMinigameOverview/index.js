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

    const findObj = {}

    if (req.query.pacientId === undefined || req.query.pacientId == null){
        context.res = {
            status: 400,
            body: "ID do paciente necessário!" 
        }
        context.done();
        return;
    }
    findObj.pacientId = req.query.pacientId;
    if (req.query.minigameType)
        findObj.minigameType = req.query.minigameType;
    if (req.query.gameDevice)
        findObj.gameDevice = req.query.gameDevice;
            
    try {

        const minigamesOverview = await MinigameOverviewModel.find(findObj);
        context.log("[OUTPUT] - MinigameOverview Get");
        context.res = {
            status: 200,
            body: minigamesOverview
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        }
    }

    context.done();
};



