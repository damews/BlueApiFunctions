module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //PlataformOverview Schema
    require('../shared/Pacient');
    const PacientModel = mongoose.model('Pacient');

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
            body: "ID do paciente necessário."
        }
        context.done();
        return;
    }


    try {
        const pacients = await PacientModel.findById(req.params.pacientId);
        context.log("[OUTPUT] - Pacient Get by ID");
        context.res = {
            status: 200,
            body: pacients
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        }
    }

    context.done();
};