const { compareSync } = require('bcryptjs');

const errorMessages = require('../constants/errorMessages');

module.exports = class PlataformOverviewService {
  constructor({ userAccountRepository, context } = {}) {
    this.userAccountRepository = userAccountRepository;
    this.context = context;
  }

  async authenticate(username, password) {
    const user = await this.userAccountRepository.findOne({ username });
    if (!user) {
      return { error: errorMessages.USER_NOT_FOUND };
    }
    if (user.role === 'Administrator') {
      if (!compareSync(password, user.password)) {
        return { error: errorMessages.INVALID_PASSWORD };
      }
    } else if (password !== user.password) {
      return { error: errorMessages.INVALID_PASSWORD };
    }

    const authTime = new Date();
    const authExpirationTime = new Date(authTime);
    authExpirationTime.setHours(authExpirationTime.getHours() + 2);

    const result = {
      redirectUrl: '/',
      authTime,
      authExpirationTime,
      fullname: user.fullname,
      gameToken: user.gameToken.token,
      // eslint-disable-next-line no-underscore-dangle
      userId: user._id,
      role: user.role,
      pacientId: user.pacientId,
    };

    return result;
  }
};
