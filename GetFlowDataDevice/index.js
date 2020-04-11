module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    require('../shared/FlowDataDevice');
    const FlowDataDeviceModel = mongoose.model('FlowDataDevice');

    const utils = require('../shared/utils');

    utils.validateHeaders(req.headers, context);

    var isVerifiedGameToken = await utils.verifyGameToken(req.headers.gametoken, mongoose);

    if(!isVerifiedGameToken){
        context.res = {
            status: 403,
            body: "Token do jogo inexistente."
        }
        context.done();
        return;
    }

    if (req.params.flowDataDeviceId === undefined || req.params.flowDataDeviceId == null) {
        context.res = {
            status: 400,
            body: "ID do registro necessário."
        }
        context.done();
        return;
    }

    const findObj = {
        flowDataDeviceId: req.params.flowDataDeviceId,
        _gameToken: req.headers.gametoken 
    }

    try {
        const flowDataDevice = await FlowDataDeviceModel.find(findObj);
        context.log("[OUTPUT] - FlowDataDevice Get by ID");
        context.res = {
            status: 200,
            body: flowDataDevice
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        }
    }

    context.done();
};