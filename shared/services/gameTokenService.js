const { v4: uuidv4 } = require('uuid');

const errorMessages = require('../constants/errorMessages');

module.exports = class GameTokenService {
  constructor(accountRepository, context) {
    this.accountRepository = accountRepository;
    this.context = context;
  }

  async create(info) {
    const user = await this.accountRepository.findById(info.userId);

    if (!user) {
      return { error: errorMessages.USER_NOT_FOUND };
    }

    if (user.role === 'User') {
      return { error: errorMessages.INVALID_ROLE_GAMETOKEN };
    }

    if (user.gameToken.token !== '') {
      return { error: errorMessages.TOKEN_ALREADY_GENERATED };
    }

    user.gameToken.token = uuidv4();
    user.gameToken.description = info.description;
    user.gameToken.createdAt = new Date().toISOString();

    const savedUser = await user.save();

    return savedUser;
  }

  async validate(gameToken) {
    const user = await this.accountRepository.findOne({ 'gameToken.token': gameToken });
    if (!user) return false;
    return true;
  }
};
