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

    if (!isVerifiedGameToken) {
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

    const findObj = {
        _gameToken: req.headers.gametoken
    }

    if (req.query.plataformOverviewId)
        findObj._id = req.query.plataformOverviewId
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
        context.log("[DB QUERYING] - PlataformOverview Get");
        context.res = {
            status: 200,
            body: utils.createResponse(false,
                false,
                "Parâmetros de consulta inexistentes.",
                plataformOverviews,
                300)
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



