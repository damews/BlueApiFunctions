module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //PlataformOverview Schema
    require('../shared/PlataformOverview');
    require('../shared/FlowDataDevice');
    const PlataformOverviewModel = mongoose.model('PlataformOverview');
    const FlowDataDeviceModel = mongoose.model('FlowDataDevice');

    const utils = require('../shared/utils');

    var isVerifiedGameToken = await utils.verifyGameToken(req.headers.gametoken, mongoose);

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: "Token do jogo inexistente."
        }
        context.done();
        return;
    }

    const plataformOverviewReq = req.body || {};

    if (Object.entries(plataformOverviewReq).length === 0) {
        context.res = {
            status: 400,
            body: "Resumo da Plataforma necessário!"
        }
        context.done();
        return;
    }

    plataformOverviewReq._gameToken = req.headers.gametoken;

    var flowDataDevicesReq = req.body.flowDataDevices;

    delete plataformOverviewReq.flowDataDevices;

    try {
        const savedFlowDataDevices = await (new FlowDataDeviceModel({ _gameToken: req.headers.gametoken, flowDataDevices: flowDataDevicesReq })).save();
        plataformOverviewReq.flowDataDevicesId = savedFlowDataDevices._id;
        const savedPlataformOverview = await (new PlataformOverviewModel(plataformOverviewReq)).save();
        context.log("[OUTPUT] - PlataformOverview Saved: ", savedPlataformOverview);
        context.res = {
            status: 201,
            body: savedPlataformOverview
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        }
    }

    context.done();
};