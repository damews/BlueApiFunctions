module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //PlataformOverview Schema
    require('../shared/PlataformOverview');
    const PlataformOverviewModel = mongoose.model('PlataformOverview');

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

    if (req.params.pacientId === undefined || req.params.pacientId == null) {
        context.res = {
            status: 400,
            body: "ID do paciente necessário!"
        }
        context.done();
        return;
    }
    
    const findObj = {
        pacientId: req.params.pacientId,
        _gameToken: req.headers.gametoken
    }

    if (req.query.phase)
        findObj.phase = req.query.phase;
    if (req.query.level)
        findObj.level = req.query.level;
    if (req.query.dataInicial)
        findObj.dataInicial = req.query.dataInicial;
    if (req.query.dataFinal)
        findObj.dataFinal = req.query.dataFinal;
    if (req.query.gameDevice)
        findObj.gameDevice = req.query.gameDevice;

    try {

        const plataformOverviews = await PlataformOverviewModel.find(findObj);
        context.log("[OUTPUT] - Pacient PlataformOverview Get");
        context.res = {
            status: 200,
            body: plataformOverviews
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        }
    }

    context.done();
};



