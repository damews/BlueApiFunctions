module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    require('../shared/UserAccount');
    const UserAccountModel = mongoose.model('UserAccount');

    const responseUtils = require('../shared/http/responseUtils');
    const inputValidator = require('../shared/validations/accountCreateInputValidator');
    const errorMessages = require('../shared/http/errorMessages');
    const infoMessages = require('../shared/http/infoMessages');

    const bcrypt = require("bcryptjs");

    const userAccountReq = req.body || {};

    if (Object.entries(userAccountReq).length === 0) {
        context.res = {
            status: 400,
            body: responseUtils.createResponse(false, false, errorMessages.EMPTY_REQUEST, null)
        }
        context.done();
        return;
    }

    let validationResult = inputValidator.createUserValidator(userAccountReq);

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

        if (userAccountReq.role == "Administrator") {
            const existingUser = await UserAccountModel.findOne({ $or: [{ email: userAccountReq.email, role: "Administrator" }, { username: userAccountReq.username, role: "Administrator" }] });
            context.log("[DB FIND] - Find Existing User: ", existingUser);

            if (existingUser) {
                context.res = {
                    status: 400,
                    body: responseUtils.createResponse(true, false, errorMessages.USERNAME_EMAIL_ALREADY_USED, null)
                }
                context.done();
                return;
            }
        }

        if (userAccountReq.role == "User") {
            const existingUser = await UserAccountModel.findOne({ username: userAccountReq.username, role: "User", "gameToken.token": userAccountReq.gameToken });
            context.log("[DB FIND] - Find Existing User: ", existingUser);

            if (existingUser) {
                context.res = {
                    status: 400,
                    body: responseUtils.createResponse(false, false, errorMessages.USERNAME_EMAIL_ALREADY_USED, null, null)
                }
                context.done();
                return;
            }
        }

        var newUser = new UserAccountModel({
            fullname: userAccountReq.fullname,
            username: userAccountReq.username,
            password: userAccountReq.role == "Administrator" ? bcrypt.hashSync(userAccountReq.password, 10) : userAccountReq.password,
            email: userAccountReq.role == "Administrator" ? userAccountReq.email : userAccountReq.username,
            role: userAccountReq.role,
            pacientId: userAccountReq.role == "User" ? userAccountReq.pacientId : "",
            gameToken: {
                token: userAccountReq.role == "Administrator" ? "" : userAccountReq.gameToken,
                description: "",
                createdAt: null
            }
        });

        const savedUser = await newUser.save();
        context.log("[DB SAVING] - User Account Created: ", savedUser);
        
        context.res = {
            status: 201,
            body: responseUtils.createResponse(true, false, infoMessages.SUCCESSFULLY_REGISTERED, null)
        }



    } catch (err) {
        context.log("[DB SAVING] - ERROR: ", err);
        context.res = {
            status: 500,
            body: responseUtils.createResponse(false, false, errorMessages.DEFAULT_ERROR, null)
        }
    }
    context.done();
};