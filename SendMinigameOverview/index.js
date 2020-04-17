module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
    require('../shared/MinigameOverview');
    require('../shared/FlowDataDevice');
    const MinigameOverviewModel = mongoose.model('MinigameOverview');
    const FlowDataDeviceModel = mongoose.model('FlowDataDevice');

    const utils = require('../shared/utils');

    utils.validateHeaders(req.headers, context);

    var isVerifiedGameToken = await utils.verifyGameToken(req.headers.gametoken, mongoose);

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: "Token do jogo inexistente."
        }
        context.done();
        return;
    }

    const minigameOverviewReq = req.body || {};

    if (Object.entries(minigameOverviewReq).length === 0) {
        context.res = {
            status: 400,
            body: "Resumo do Minigame necessário!"
        }
        context.done();
        return;
    }

    var flowDataDevicesIds = [];

    var flowDataDevicesObjects = minigameOverviewReq.flowDataRounds.map(x => x.flowDataDevices);

    minigameOverviewReq.flowDataRounds.map(x => delete x.flowDataDevices);

    try {
        const saveFlowDataDevices = async () =>{
            for (const flowDataDevices of flowDataDevicesObjects) {
                var savedFlowDataDevices = await (new FlowDataDeviceModel({ flowDataDevices: flowDataDevices })).save();
                flowDataDevicesIds.push(savedFlowDataDevices._id);
            }
        }
        
        await saveFlowDataDevices();

        minigameOverviewReq.flowDataRounds[0].flowDataDevicesId = flowDataDevicesIds[0];
        minigameOverviewReq.flowDataRounds[1].flowDataDevicesId = flowDataDevicesIds[1];
        minigameOverviewReq.flowDataRounds[2].flowDataDevicesId = flowDataDevicesIds[2];

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