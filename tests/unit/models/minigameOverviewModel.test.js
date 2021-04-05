const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/minigameOverview');
require('../../../shared/database/models/flowDataDevice');

const minigameOverviewSeed = require('./seed-data/minigameOverview-data');
const flowDataDeviceSeed = require('./seed-data/flowDataDevice-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let minigameOverviewRepository;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = await mongooseDatabase.connect(mongoUri, context);
  const MinigameOverviewModel = mongoClient.model('MinigameOverview');
  const FlowDataDeviceModel = mongoClient.model('FlowDataDevice');

  const flowDataDeviceOne = new FlowDataDeviceModel(flowDataDeviceSeed.flowDataDeviceOne);
  const resultFlowDataDeviceOne = await flowDataDeviceOne.save();

  const flowDataDeviceTwo = new FlowDataDeviceModel(flowDataDeviceSeed.flowDataDeviceTwo);
  const resultFlowDataDeviceTwo = await flowDataDeviceTwo.save();

  const newMinigameOne = minigameOverviewSeed.minigameOverviewOne;
  // eslint-disable-next-line no-underscore-dangle
  newMinigameOne.flowDataRounds[0].flowDataDevicesId = resultFlowDataDeviceOne._id;
  const minigameOverviewOne = new MinigameOverviewModel(newMinigameOne);
  await minigameOverviewOne.save();

  const newMinigameTwo = minigameOverviewSeed.minigameOverviewTwo;
  // eslint-disable-next-line no-underscore-dangle
  newMinigameTwo.flowDataRounds[0].flowDataDevicesId = resultFlowDataDeviceTwo._id;
  const minigameOverviewTwo = new MinigameOverviewModel(newMinigameTwo);
  await minigameOverviewTwo.save();

  minigameOverviewRepository = new MongooseRepository(MinigameOverviewModel);
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it.each(['CakeGame', 'WaterGame'])('should return only one entity when searching by minigameName %s', async (minigameName) => {
  const results = await minigameOverviewRepository.find({ minigameName });
  expect(results.length).toEqual(1);
});

it('should return two entities when searching by device Pitaco', async () => {
  const results = await minigameOverviewRepository.find({ devices: 'Pitaco' });
  expect(results.length).toEqual(2);
});
