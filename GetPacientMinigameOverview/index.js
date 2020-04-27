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
            body: utils.createResponse(false,
                false,
                "Chave de acesso inválida.",
                null,
                1)
        }
        context.done();
        return;
    }


    if (req.params.pacientId === undefined || req.params.pacientId == null){
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

    if (req.query.minigameName)
        findObj.minigameName = req.query.minigameName;
    if (req.query.gameDevice)
        findObj.gameDevice = req.query.gameDevice;
            
    try {

        const minigamesOverview = await MinigameOverviewModel.find(findObj);
        context.log("[DB QUERYING] - MinigameOverview Get by Pacient ID");
        context.res = {
            status: 200,
            body: utils.createResponse(true,
                true,
                "Consulta realizada com sucesso.",
                minigamesOverview,
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



