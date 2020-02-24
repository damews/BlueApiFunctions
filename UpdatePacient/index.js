module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    var obje

    //MinigameOverview Schema
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
    
    const pacientReq = req.body || {};

    if(req.params.pacientId === undefined || req.params.pacientId == null){
        context.res = {
            status: 400,
            body: "ID do Paciente necessário!"
        }
        context.done();
        return;
    }

    try {
        const updatedPacient = await PacientModel.updateOne(
            { _id: req.params.pacientId },
            {
                $set:
                    { 
                        name: req.body.name,
                        birthday: req.body.birthday,
                        sex: req.body.sex,
                        weigth: req.body.weigth,
                        heigth: req.body.heigth,
                        ethnicity: req.body.ethnicity,
                        condition: req.body.condition
                    }
            });
        context.log("[OUTPUT] - Pacient Updated: ", updatedPacient);
		context.res = {
            status: 200,
            body: updatedPacient
        }
	} catch (err) {
		context.res = {
            status: 500,
            body: err
        }
    }
    
    context.done();
};