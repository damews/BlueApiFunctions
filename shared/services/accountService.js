const { hashSync } = require('bcryptjs');

const errorMessages = require('../constants/errorMessages');

module.exports = class AccountService {
  constructor(accountRepository, context) {
    this.accountRepository = accountRepository;
    this.context = context;
  }

  async create(account) {
    if (account.role === 'Administrator') {
      const existingAccount = await this.accountRepository.findOne({ $or: [{ email: account.email, role: 'Administrator' }, { username: account.username, role: 'Administrator' }] });
      if (existingAccount) {
        return { error: errorMessages.USERNAME_EMAIL_ALREADY_USED };
      }
    } else {
      const existingAccount = await this.accountRepository.Model.findOne({ username: account.username, role: 'User', 'gameToken.token': account.gameToken });
      if (existingAccount) {
        return { error: errorMessages.USERNAME_ALREADY_USED };
      }
    }

    const newAccount = {
      fullname: account.fullname,
      username: account.username,
      password: account.role === 'Administrator' ? hashSync(account.password, 10) : account.password,
      email: account.role === 'Administrator' ? account.email : account.username,
      role: account.role,
      pacientId: account.role === 'User' ? account.pacientId : '',
      gameToken: {
        token: account.role === 'Administrator' ? '' : account.gameToken,
        description: '',
        createdAt: null,
      },
    };

    return this.accountRepository.create(newAccount);
  }

  async getPacientAccount(pacientId) {
    const result = await this.accountRepository.findOne({ pacientId });

    return {
      // eslint-disable-next-line no-underscore-dangle
      _id: result._id,
      pacientId: result.pacientId,
      username: result.username,
      password: result.password,
    };
  }

  async deleteManyByPacientId(pacientId) {
    return this.accountRepository.deleteMany({ pacientId });
  }
};
