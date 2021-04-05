const idSeed = require('./ids-data');

module.exports = {
  flowDataDeviceOne: {
    _gameToken: idSeed.gameTokenOne,
    pacientId: idSeed.pacientIdOne,
    flowDataDevices: [{
      deviceName: 'Pitaco',
      flowData: [
        { flowValue: 10, timestamp: new Date() },
        { flowValue: 15, timestamp: new Date() },
        { flowValue: 20, timestamp: new Date() },
        { flowValue: 30, timestamp: new Date() },
        { flowValue: 50, timestamp: new Date() },
      ],
    }],
  },
  flowDataDeviceTwo: {
    _gameToken: idSeed.gameTokenOne,
    pacientId: idSeed.pacientIdOne,
    flowDataDevices: [{
      deviceName: 'Cinta',
      flowData: [
        { flowValue: 10, timestamp: new Date() },
        { flowValue: 15, timestamp: new Date() },
        { flowValue: 20, timestamp: new Date() },
        { flowValue: 30, timestamp: new Date() },
        { flowValue: 50, timestamp: new Date() },
      ],
    }],
  },
};
