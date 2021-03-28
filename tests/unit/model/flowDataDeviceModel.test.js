const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/flowDataDevice');

const flowDataDeviceSeed = require('./seed-data/flowDataDevice-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let flowDataDeviceRepository;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = await mongooseDatabase.connect(mongoUri, context);
  const FlowDataDeviceModel = mongoClient.model('FlowDataDevice');

  const flowDataDeviceOne = new FlowDataDeviceModel(flowDataDeviceSeed.flowDataDeviceOne);
  await flowDataDeviceOne.save();

  const flowDataDeviceTwo = new FlowDataDeviceModel(flowDataDeviceSeed.flowDataDeviceTwo);
  await flowDataDeviceTwo.save();

  flowDataDeviceRepository = new MongooseRepository(FlowDataDeviceModel);
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it('should return two entities', async () => {
  const results = await flowDataDeviceRepository.find();
  expect(results.length).toEqual(2);
});
