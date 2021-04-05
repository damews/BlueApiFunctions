const idSeed = require('./ids-data');

module.exports = {
  minigameOverviewOne: {
    _gameToken: idSeed.gameTokenOne,
    pacientId: idSeed.pacientIdOne,
    respiratoryExercise: 'ExpiratoryPeak',
    minigameName: 'CakeGame',
    devices: ['Pitaco'],
    flowDataRounds: [
      {
        minigameRound: 1,
        roundScore: 100,
        roundFlowScore: 100,
        flowDataDevicesId: '',
      },
    ],
  },
  minigameOverviewTwo: {
    _gameToken: idSeed.gameTokenOne,
    pacientId: idSeed.pacientIdOne,
    respiratoryExercise: 'InpiratoryPeak',
    minigameName: 'WaterGame',
    devices: ['Pitaco'],
    flowDataRounds: [
      {
        minigameRound: 1,
        roundScore: 100,
        roundFlowScore: 100,
        flowDataDevicesId: '',
      },
    ],
  },
};
