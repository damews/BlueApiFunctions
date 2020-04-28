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

    const validators = require("../shared/Validators");
    const validate = require("validate.js");
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

    const plataformOverviewReq = req.body || {};

    if (Object.entries(plataformOverviewReq).length === 0) {
        context.res = {
            status: 400,
            body: utils.createResponse(false,
                true,
                "Dados vazios!",
                null,
                2)
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
            body: utils.createResponse(true,
                true,
                "Plataforma salva com sucesso.",
                savedCalibrationOverview,
                null)
        }
    } catch (err) {
        context.log("[DB SAVING] - ERROR: ", err);
        context.res = {
            status: 500,
            body:  utils.createResponse(false,
                true,
                "Ocorreu um erro interno ao realizar a operação.",
                null,
                00)
        }
    }

    context.done();
};