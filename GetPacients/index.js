module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //PlataformOverview Schema
    require('../shared/Pacient');
    const PacientModel = mongoose.model('Pacient');

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

    const matchOperators = { $match: { _gameToken: req.headers.gametoken } }

    const aggregate = PacientModel.aggregate();

    if (req.query.name)
        matchOperators.$match.name = { $regex: "^" + req.query.name + ".*", $options: 'i' };
    if (req.query.condition)
        matchOperators.$match.condition = { $eq: req.query.condition };
    if (req.query.sex)
        matchOperators.$match.sex = { $eq: req.query.sex };

    if (req.query.fromAge) {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setFullYear(date.getFullYear() - req.query.fromAge);
        matchOperators.$match.birthday = {
            $lte: new Date(date.toISOString())
        };
    }
    if (req.query.toAge) {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setFullYear(date.getFullYear() - req.query.toAge);
        matchOperators.$match.birthday = {
            $gte: new Date(date.toISOString())
        };
    }
    if (req.query.fromAge && req.query.toAge) {
        let fromAgeDate = new Date();
        fromAgeDate.setHours(0, 0, 0, 0);
        fromAgeDate.setFullYear(fromAgeDate.getFullYear() - req.query.toAge);

        let toAgeDate = new Date();
        toAgeDate.setHours(0, 0, 0, 0);
        toAgeDate.setFullYear(toAgeDate.getFullYear() - req.query.fromAge);

        matchOperators.$match.birthday = {
            $lte: new Date(toAgeDate.toISOString()),
            $gte: new Date(fromAgeDate.toISOString())
        };

    }

    aggregate.append(matchOperators);

    if (req.query.sort == "asc")
        aggregate.sort({ name: 1 })
    else
        aggregate.sort({ name: -1 })

    aggregate.lookup({
        from: 'playsessions',
        'let': {
            id: '$_id'
        },
        pipeline: [
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $toObjectId: '$pacientId' }, '$$id'] }
                        ]
                    }
                }
            }
        ],
        as: 'playSessions'
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
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, pacients, null)
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