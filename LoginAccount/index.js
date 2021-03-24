module.exports = async function (context, req) {
  const mongoose = require('mongoose');
  const DATABASE = process.env.MongoDbAtlas;
  mongoose.connect(DATABASE);
  mongoose.Promise = global.Promise;

  require('../shared/UserAccount');
  const UserAccountModel = mongoose.model('UserAccount');

  const responseUtils = require('../shared/http/responseUtils');
  const errorMessages = require('../shared/http/errorMessages');
  const infoMessages = require('../shared/http/infoMessages');
  const inputValidator = require('../shared/validations/authenticateInputValidator');

  const bcrypt = require('bcryptjs');

  const userAccountReq = req.body || {};

  if (Object.entries(userAccountReq).length === 0) {
    context.res = {
      status: 400,
      body: responseUtils.createResponse(false, false, errorMessages.EMPTY_REQUEST, null),
    };
    context.done();
    return;
  }

  const validationResult = inputValidator.authenticateValidator(userAccountReq);
  if (validationResult.errorCount !== 0) {
    const response = responseUtils.createResponse(false, true, errorMessages.VALIDATION_ERROR_FOUND, null);
    response.errors = validationResult.errors.errors;
    context.res = {
      status: 400,
      body: response,
    };
    context.done();
    return;
  }

  try {
    context.log('[DB FINDING] - Finding User Account: ', userAccountReq.username);
    const user = await UserAccountModel.findOne({ username: userAccountReq.username });
    if (!user) {
      context.res = {
        status: 404,
        body: responseUtils.createResponse(false, false, errorMessages.USER_NOT_FOUND, null),
      };
      context.done();
      return;
    }
    if (user.role == 'Administrator') {
      if (!bcrypt.compareSync(userAccountReq.password, user.password)) {
        context.res = {
          status: 401,
          body: responseUtils.createResponse(false, false, errorMessages.INVALID_PASSWORD, null),
        };
        context.done();
        return;
      }
    } else if (userAccountReq.password != user.password) {
      context.res = {
        status: 401,
        body: responseUtils.createResponse(false, false, errorMessages.INVALID_PASSWORD, null),
      };
      context.done();
      return;
    }

    const authTime = new Date();
    const authExpirationTime = new Date(authTime);
    authExpirationTime.setHours(authExpirationTime.getHours() + 2);

    context.res = {
      status: 200,
      body: responseUtils.createResponse(true, true, infoMessages.SUCCESSFULLY_AUTHENTICATION,
        {
          redirectUrl: '/', authTime, authExpirationTime, fullname: user.fullname, gameToken: user.gameToken.token, userId: user._id, role: user.role, pacientId: user.pacientId,
        }),
    };
  } catch (err) {
    context.log('[DB SAVING] - ERROR: ', err);
    context.res = {
      status: 500,
      body: responseUtils.createResponse(false, false, errorMessages.DEFAULT_ERROR, null),
    };
  }
  context.done();
};
