const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const AccountService = require('../../../shared/services/accountService');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/userAccount');

const userAccountSeed = require('../models/seed-data/userAccount-data');

const errorMessages = require('../../../shared/constants/errorMessages');

const idsSeed = require('../models/seed-data/ids-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let accountRepository;
let accountService;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = await mongooseDatabase.connect(mongoUri, context);
  const UserAccountModel = mongoClient.model('UserAccount');

  const adminstratorJohnDoe = new UserAccountModel(userAccountSeed.userAccounAdministratortOne);
  await adminstratorJohnDoe.save();

  const pacientMikeDoe = new UserAccountModel(userAccountSeed.userAccountPacientOne);
  await pacientMikeDoe.save();

  accountRepository = new MongooseRepository(UserAccountModel);

  accountService = new AccountService(accountRepository, context);
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it('should return USER_ALREADY_USED error when creating a Adminstrator account with existing email', async () => {
  // Arrange
  const newAccount = {
    email: 'johndoe@email.com',
    fullname: 'John Doe',
    username: 'johndoe',
    password: 'password',
    role: 'Administrator',
  };

  const error = { error: errorMessages.USERNAME_EMAIL_ALREADY_USED };

  // Act
  const serviceReturn = await accountService.create(newAccount);

  // Assert
  expect(serviceReturn).toHaveProperty('error');
  expect(serviceReturn).toMatchObject(error);
});

it('should return USER_ALREADY_USED error when creating a User account with existing username', async () => {
  // Arrange
  const newAccount = {
    fullname: 'Mike Doe',
    username: 'mikedoe',
    password: 'password',
    email: 'mikedoe@email.com',
    role: 'User',
    pacientId: idsSeed.pacientIdOne,
  };

  const error = { error: errorMessages.USERNAME_ALREADY_USED };

  // Act
  const serviceReturn = await accountService.create(newAccount);

  // Assert
  expect(serviceReturn).toHaveProperty('error');
  expect(serviceReturn).toMatchObject(error);
});

it('should return user account when searching by pacientId', async () => {
  // Act
  const serviceReturn = await accountService.getPacientAccount(idsSeed.pacientIdOne);

  // Assert
  expect(serviceReturn.fullname).toBe('Mike Doe');
});
