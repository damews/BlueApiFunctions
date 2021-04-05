const idSeed = require('./ids-data');

module.exports = {
  calibrationOverviewOne: {
    _gameToken: idSeed.gameTokenOne,
    pacientId: idSeed.pacientIdOne,
    gameDevice: 'Pitaco',
    calibrationValue: 10,
    calibrationExercise: 'ExpiratoryPeak',
  },
  calibrationOverviewTwo: {
    _gameToken: idSeed.gameTokenOne,
    pacientId: idSeed.pacientIdOne,
    gameDevice: 'Pitaco',
    calibrationValue: 10,
    calibrationExercise: 'InspiratoryPeak',
  },
};
