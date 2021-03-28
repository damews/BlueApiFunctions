const { MongoMemoryServer } = require('mongodb-memory-server');

const MongooseRepository = require('../../../shared/database/repositories/mongooseRepository');

const mongooseDatabase = require('../../../shared/database/mongoDatabase');

const context = require('../defaultContext');

require('../../../shared/database/models/calibrationOverview');

const calibrationOverviewSeed = require('./seed-data/calibrationOverview-data');
const idsSeed = require('./seed-data/ids-data');

jest.setTimeout(10000);

let mongoServer;
let mongoClient;
let calibrationOverviewRepository;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = await mongooseDatabase.connect(mongoUri, context);
  const CalibrationOverviewModel = mongoClient.model('CalibrationOverview');

  const calibrationOverviewOne = new CalibrationOverviewModel(
    calibrationOverviewSeed.calibrationOverviewOne,
  );
  await calibrationOverviewOne.save();

  const calibrationOverviewTwo = new CalibrationOverviewModel(
    calibrationOverviewSeed.calibrationOverviewTwo,
  );

  await calibrationOverviewTwo.save();

  calibrationOverviewRepository = new MongooseRepository(CalibrationOverviewModel);
});

afterAll(async () => {
  await mongooseDatabase.close(mongoClient, context);
  await mongoServer.stop();
});

it('should return two entities when searching by gameDevice Pitaco ', async () => {
  const results = await calibrationOverviewRepository.find({ gameDevice: 'Pitaco' });
  expect(results.length).toEqual(2);
});

it('should return only one entity when searching by calibrationExercise ExpiratoryPeak ', async () => {
  const results = await calibrationOverviewRepository.find({ calibrationExercise: 'ExpiratoryPeak' });
  expect(results.length).toEqual(1);
});

it('should return only one entity when searching by calibrationExercise InspiratoryPeak ', async () => {
  const results = await calibrationOverviewRepository.find({ calibrationExercise: 'InspiratoryPeak' });
  expect(results.length).toEqual(1);
});

it('should return two entities when searching by gameTokenOne ', async () => {
  const results = await calibrationOverviewRepository.find({ _gameToken: idsSeed.gameTokenOne });
  expect(results.length).toEqual(2);
});
