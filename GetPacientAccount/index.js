module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //PlataformOverview Schema
    require('../shared/UserAccount');
    const UserAccountModel = mongoose.model('UserAccount');

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
            body: responseUtils.createResponse(false, true, errorMessages.INVALID_REQUEST, null)
        }
        context.done();
        return;
    }

    try {
        const pacient = await UserAccountModel.findOne({ pacientId: req.params.pacientId }, '_id pacientId username password');
        context.log("[DB QUERYING] - Pacient Account Get by ID");
        context.res = {
            status: 200,
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, pacient)
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