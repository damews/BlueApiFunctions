const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/playSession');

const playSessiontSeed = require('./seed-data/playSession-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let pacientRepository;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = await mongooseDatabase.connect(mongoUri, context);
  const PlaySessionModel = mongoClient.model('PlaySession');

  const playSessionOne = new PlaySessionModel(playSessiontSeed.playSessionOne);
  await playSessionOne.save();

  pacientRepository = new MongooseRepository(PlaySessionModel);
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it('should return only one entity', async () => {
  const results = await pacientRepository.find();
  expect(results.length).toEqual(1);
});
