module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    require('../shared/UserAccount');
    const UserAccountModel = mongoose.model('UserAccount');

    const utils = require('../shared/utils');

    const bcrypt = require("bcryptjs");

    const userAccountReq = req.body || {};

    if (Object.entries(userAccountReq).length === 0) {
        context.res = {
            status: 400,
            body: utils.createResponse(false,
                false,
                "Dados vazios!",
                null,
                2)
        }
        context.done();
        return;
    }

    try {
        context.log("[DB FINDING] - Finding User Account: ", userAccountReq.username);
        const user = await UserAccountModel.findOne({ username: userAccountReq.username });
        if (!user) {
            context.res = {
                status: 404,
                body: utils.createResponse(false,
                    false,
                    "Este usuário não existe!.",
                    null,
                    null)
            }
            context.done();
            return;
        }
        if (!bcrypt.compareSync(userAccountReq.password, user.password)) {
            context.res = {
                status: 401,
                body: utils.createResponse(false,
                    false,
                    "Senha inválida!.",
                    null,
                    null)
            }
            context.done();
            return;
        }

        var authTime = new Date();
        var authExpirationTime = new Date(authTime);
        authExpirationTime.setHours(authExpirationTime.getHours() + 2);

        context.res = {
            status: 200,
            body: utils.createResponse(true,
                true,
                "Authenticado com sucesso!.",
                { redirectUrl: '/', authTime: authTime, authExpirationTime: authExpirationTime, fullname: user.fullname, gameToken: user.gameToken.token, userId: user._id, role: user.role},
                null)
        }
    } catch (err) {
        context.log("[DB SAVING] - ERROR: ", err);
        context.res = {
            status: 500,
            body: utils.createResponse(false,
                false,
                "Ocorreu um erro interno ao realizar a operação.",
                null,
                00)
        }
    }
    context.done();
};