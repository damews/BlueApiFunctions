module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/MinigameOverview');
    const MinigameOverviewModel = mongoose.model('MinigameOverview');

    const authorizationUtils = require('../shared/authorization/tokenVerifier');
    const responseUtils = require('../shared/http/responseUtils');
    const errorMessages = require('../shared/http/errorMessages');
    const infoMessages = require('../shared/http/infoMessages');

    var isVerifiedGameToken = await authorizationUtils.verifyGameToken(req.headers.gametoken, mongoose);

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: responseUtils.createResponse(false, false, errorMessages.INVALID_TOKEN, null)
        }
        context.done();
        return;
    }


    if (req.params.pacientId === undefined || req.params.pacientId == null) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, false, errorMessages.INVALID_REQUEST, null)
        }
        context.done();
        return;
    }

    const findObj = {
        pacientId: req.params.pacientId,
        _gameToken: req.headers.gametoken
    }

    const findOptionsObj = { sort: { created_at: -1 } };

    if (req.query.minigameName)
        findObj.minigameName = req.query.minigameName;
    if (req.query.devices)
        findObj.devices = req.query.devices.split(',');
    if (req.query.dataIni)
        findObj.created_at = {
            $gte: new Date(req.query.dataIni).toISOString("yyyy-MM-ddThh:mm:ss.msZ")
        };
    if (req.query.dataIni && req.query.dataFim)
        findObj.created_at = {
            $gte: new Date(`${req.query.dataIni} 00:00:00:000 UTC`).toISOString("yyyy-MM-ddThh:mm:ss.msZ"),
            $lte: new Date(`${req.query.dataFim} 23:59:59:999 UTC`).toISOString("yyyy-MM-ddThh:mm:ss.msZ")
        };
    if (req.query.limit)
        findOptionsObj.limit = parseInt(req.query.limit);
    if (req.query.skip)
        findOptionsObj.skip = parseInt(req.query.skip);
    if (req.query.sort == "asc")
        findOptionsObj.sort = { created_at: 1 };


    try {
        const minigamesOverview = await MinigameOverviewModel.find(findObj, null, findOptionsObj);
        context.log("[DB QUERYING] - MinigameOverview Get by Pacient ID");
        context.res = {
            status: 200,
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, minigamesOverview)
        }
    } catch (err) {
        context.log("[DB QUERYING] - ERROR: ", err);
        context.res = {
            status: 500,
            body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null)
        }
    }

    context.done();
};