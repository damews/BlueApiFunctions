module.exports = async function (context, req) {
    const mongoose = require('mongoose');
    const DATABASE = process.env.MongoDbAtlas;
    mongoose.connect(DATABASE);
    mongoose.Promise = global.Promise;

    //MinigameOverview Schema
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

    var existingUserFinder = { email: userAccountReq.email, username: userAccountReq.username };

    try {

        const existingUser = await UserAccountModel.findOne(existingUserFinder);
        context.log("[DB FIND] - Find Existing User: ", existingUserFinder);


        if (existingUser) {
            context.res = {
                status: 400,
                body: utils.createResponse(true,
                    false,
                    "Já existe um usuário cadastrado com este nome e email.",
                    null,
                    null)
            }
            context.done();
            return;
        }

        var newUser = new UserAccountModel({
            fullname: userAccountReq.fullname,
            username: userAccountReq.username,
            password: bcrypt.hashSync(userAccountReq.password, 10),
            email: userAccountReq.email,
            role: "Administrator",
            gameToken: {
                token: "",
                description: "",
                createdAt: null
            }
        })

        const savedUser = await newUser.save();
        context.log("[DB SAVING] - User Account Created: ", savedUser);
        
        utils.sendWelcomeEmail(savedUser.fullname, savedUser.username, userAccountReq.password, savedUser.email);

        context.res = {
            status: 201,
            body: utils.createResponse(true,
                false,
                "Usuário criado com sucesso.",
                {redirectUrl: '/login'},
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