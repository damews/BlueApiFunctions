const bcrypt = require('bcryptjs');
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
      const existingAccount = await this.accountRepository.findOne({ username: account.username, role: 'User', 'gameToken.token': account.gameToken });
      if (existingAccount) {
        return { error: errorMessages.USERNAME_ALREADY_USED };
      }
    }

    const newAccount = {
      fullname: account.fullname,
      username: account.username,
      password: account.role == 'Administrator' ? bcrypt.hashSync(account.password, 10) : account.password,
      email: account.role == 'Administrator' ? account.email : account.username,
      role: account.role,
      pacientId: account.role == 'User' ? account.pacientId : '',
      gameToken: {
        token: account.role == 'Administrator' ? '' : account.gameToken,
        description: '',
        createdAt: null,
      },
    };

    return await this.accountRepository.create(newAccount);
  }
};
