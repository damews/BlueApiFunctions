module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    require('../shared/UserAccount');
    const UserAccountModel = mongoose.model('UserAccount');

    const responseUtils = require('../shared/http/responseUtils');
    const inputValidator = require('../shared/validations/tokenCreateInputValidator');
    const errorMessages = require('../shared/http/errorMessages');
    const infoMessages = require('../shared/http/infoMessages');
    const { v4: uuidv4 } = require('uuid');

    const gameTokenReq = req.body || {};

    if (Object.entries(gameTokenReq).length === 0) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, true, errorMessages.EMPTY_REQUEST, null)
        }
        context.done();
        return;
    }

    let validationResult = inputValidator.createTokenValidator(gameTokenReq);
    if (validationResult.errorCount !== 0) {
        let response = responseUtils.createResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null);
        response.errors = validationResult.errors.errors;
        context.res = {
            status: 400,
            body: response
        }
        context.done();
        return;
    }

    try {

        const user = await UserAccountModel.findById(gameTokenReq.userId);

        if (!user) {
            context.res = {
                status: 404,
                body: responseUtils.createResponse(true, true, errorMessages.USER_NOT_FOUND, { userId: gameTokenReq.userId })
            }
            context.done();
            return;
        }

        if (user.gameToken.token != "") {
            context.res = {
                status: 200,
                body: responseUtils.createResponse(true, true, errorMessages.TOKEN_ALREADY_GENERATED, { gameToken: user.gameToken.token })
            }
            context.done();
            return;
        }

        user.gameToken.token = uuidv4();
        user.gameToken.description = gameTokenReq.description;
        user.gameToken.createdAt = new Date();

        const savedUser = await user.save();
        context.res = {
            status: 201,
            body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_REGISTERED_TOKEN, { gameToken: savedUser.gameToken.token })
        }

    } catch (err) {
        context.log("[DB SAVING] - ERROR: ", err);
        context.res = {
            status: 500,
            body: responseUtils.createResponse(false, true, errorMessages.DEFAULT_ERROR, null)
        }
    }

    context.done();
};