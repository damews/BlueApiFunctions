const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/plataformOverview');
require('../../../shared/database/models/flowDataDevice');

const plataformOverviewSeed = require('./seed-data/plataformOverview-data');
const flowDataDeviceSeed = require('./seed-data/flowDataDevice-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let plataformOverviewRepository;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = await mongooseDatabase.connect(mongoUri, context);
  const PlataformOverviewModel = mongoClient.model('PlataformOverview');
  const FlowDataDeviceModel = mongoClient.model('FlowDataDevice');

  const flowDataDeviceOne = new FlowDataDeviceModel(flowDataDeviceSeed.flowDataDeviceOne);
  const resultFlowDataDeviceOne = await flowDataDeviceOne.save();

  const flowDataDeviceTwo = new FlowDataDeviceModel(flowDataDeviceSeed.flowDataDeviceTwo);
  const resultFlowDataDeviceTwo = await flowDataDeviceTwo.save();

  const newPlataformOne = plataformOverviewSeed.plataformOverviewOne;
  // eslint-disable-next-line no-underscore-dangle
  newPlataformOne.flowDataDevicesId = resultFlowDataDeviceOne._id;
  const plataformOverviewOne = new PlataformOverviewModel(newPlataformOne);
  await plataformOverviewOne.save();

  const newPlataformTwo = plataformOverviewSeed.plataformOverviewTwo;
  // eslint-disable-next-line no-underscore-dangle
  newPlataformTwo.flowDataDevicesId = resultFlowDataDeviceTwo._id;
  const plataformOverviewTwo = new PlataformOverviewModel(newPlataformTwo);
  await plataformOverviewTwo.save();

  plataformOverviewRepository = new MongooseRepository(PlataformOverviewModel);
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it.each`
devices     | expected
${'Pitaco'} | ${2}
${'Cinta'}  | ${1}
`('should return expected quantity ($expected) of entities when searching by devices $devices', async ({ devices, expected }) => {
  const results = await plataformOverviewRepository.find({ devices });
  expect(results.length).toEqual(expected);
});
