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

    if (!isVerifiedGameToken) {
        context.res = {
            status: 403,
            body: "Token do jogo inexistente."
        }
        context.done();
        return;
    }

    const pacientReq = req.body || {};

    if (req.params.pacientId === undefined || req.params.pacientId == null) {
        context.res = {
            status: 400,
            body: "ID do Paciente necessário!"
        }
        context.done();
        return;
    }

    pacientReq._gameToken = req.headers.gametoken;

    try {
        const updatedPacient = await PacientModel.updateOne(
            { _id: req.params.pacientId },
            {
                $set:
                {
                    name: req.body.name,
                    sex: req.body.sex,
                    birthday:  req.body.birthday,
                    capacitiesPitaco: {
                        insPeakFlow: req.body.capacitiesPitaco.insPeakFlow,
                        expPeakFlow: req.body.capacitiesPitaco.expPeakFlow,
                        insFlowDuration: req.body.capacitiesPitaco.insFlowDuration,
                        expFlowDuration: req.body.capacitiesPitaco.expFlowDuration,
                        respiratoryRate: req.body.capacitiesPitaco.respiratoryRate,
                    },
                    capacitiesMano: {
                        insPeakFlow: req.body.capacitiesMano.insPeakFlow,
                        expPeakFlow: req.body.capacitiesMano.expPeakFlow,
                        insFlowDuration: req.body.capacitiesMano.insFlowDuration,
                        expFlowDuration: req.body.capacitiesMano.expFlowDuration,
                        respiratoryRate: req.body.capacitiesMano.respiratoryRate,
                    },
                    capacitiesCinta: {
                        insPeakFlow: req.body.capacitiesCinta.insPeakFlow,
                        expPeakFlow: req.body.capacitiesCinta.expPeakFlow,
                        insFlowDuration: req.body.capacitiesCinta.insFlowDuration,
                        expFlowDuration: req.body.capacitiesCinta.expFlowDuration,
                        respiratoryRate: req.body.capacitiesCinta.respiratoryRate,
                    },
                    observations: req.bodyobservations,
                    condition: req.body.condition,
                    unlockedLevels: req.body.unlockedLevels,
                    playSessionsDone: req.body.playSessionsDone,
                    calibrationPitacoDone: req.body.calibrationPitacoDone,
                    calibrationManoDone: req.body.calibrationManoDone,
                    calibrationCintaDone: req.body.calibrationCintaDone,
                    howToPlayDone: req.body.howToPlayDone,
                    weight: req.body.weigth,
                    height: req.body.heigth,
                    pitacoThreshold: req.body.pitacoThreshold,
                    manoThreshold: req.body.manoThreshold,
                    cintaThreshold: req.body.cintaThreshold,
                    ethnicity: req.body.ethnicity,
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