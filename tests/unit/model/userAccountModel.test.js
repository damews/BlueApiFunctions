const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/userAccount');

const userAccountSeed = require('./seed-data/userAccount-data');

const idsSeed = require('./seed-data/ids-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let accountRepository;

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
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it('should return only one entity when searching by the role User ', async () => {
  const results = await accountRepository.find({ role: 'User' });
  expect(results.length).toEqual(1);
});

it('should return only one entity when searching by the role Administrator ', async () => {
  const results = await accountRepository.find({ role: 'Administrator' });
  expect(results.length).toEqual(1);
});

it('should return only one entity when searching by the pacientIdOne ', async () => {
  const results = await accountRepository.find({ pacientId: idsSeed.pacientIdOne });
  expect(results.length).toEqual(1);
});
