const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/pacient');

const pacientSeed = require('./seed-data/pacient-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let pacientRepository;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = await mongooseDatabase.connect(mongoUri, context);
  const PacientModel = mongoClient.model('Pacient');

  const pacientOne = new PacientModel(pacientSeed.pacientOne);
  await pacientOne.save();

  pacientRepository = new MongooseRepository(PacientModel);
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it('should return only one entity when searching by name starting with Mike', async () => {
  const results = await pacientRepository.find({ name: /^Mike/ });
  expect(results.length).toEqual(1);
});
