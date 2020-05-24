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

    const matchOperators = { $match: { _gameToken: req.headers.gametoken } }

    const aggregate = PacientModel.aggregate();

    if (req.query.name)
        matchOperators.$match.name = { $regex: "^" + req.query.name + ".*", $options: 'i' };

    aggregate.append(matchOperators);
    
    if (req.query.sort == "asc")
        aggregate.sort({ name: 1 })
    else
        aggregate.sort({ name: -1 })

    aggregate.lookup({
        from: "playsessions",
        let: { "pacientId": "$_id" },
        pipeline:
            [
                { "$addFields": { "pacientId": { "$toObjectId": "$pacientId" } } },
                { "$match": { "$expr": { "$eq": ["$pacientId", "$$pacientId"] } } }
            ],
        as: "playSessions"
    });

    if (req.query.limit)
        aggregate.limit(parseInt(req.query.limit))
    if (req.query.skip)
        aggregate.skip(req.query.skip);

    try {

        const pacients = await aggregate.exec();
        context.log("[DB QUERYING] - Pacient Get");
        context.res = {
            status: 200,
            body: utils.createResponse(true,
                true,
                "Consulta realizada com sucesso.",
                pacients,
                null)
        }
    } catch (err) {
        context.log("[DB QUERYING] - ERROR: ", err);
        context.res = {
            status: 500,
            body: utils.createResponse(false,
                true,
                "Ocorreu um erro interno ao realizar a operação.",
                null,
                00)
        }
    }

    context.done();
};