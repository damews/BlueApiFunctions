module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    require('../shared/FlowDataDevice');
    const FlowDataDeviceModel = mongoose.model('FlowDataDevice');

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

    if (req.params.flowDataDeviceId === undefined || req.params.flowDataDeviceId == null) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, false, errorMessages.INVALID_REQUEST, null)
        }
        context.done();
        return;
    }

    const findObj = {
        _id: req.params.flowDataDeviceId,
        _gameToken: req.headers.gametoken
    }

    try {
        const flowDataDevice = await FlowDataDeviceModel.find(findObj);
        context.log("[DB QUERYING] - FlowDataDevice Get by ID");
        context.res = {
            status: 200,
            body: responseUtils.createResponse(true,
                true,
                infoMessages.SUCCESSFULLY_REQUEST,
                flowDataDevice,
                null)
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