const idSeed = require('./ids-data');

module.exports = {
  userAccounAdministratortOne: {
    fullname: 'John Doe',
    username: 'johndoe',
    password: 'password',
    email: 'johndoe@email.com',
    role: 'Administrator',
  },
  userAccountPacientOne: {
    fullname: 'Mike Doe',
    username: 'mikedoe',
    password: 'password',
    email: 'mikedoe@email.com',
    role: 'User',
    pacientId: idSeed.pacientIdOne,
  },
};
