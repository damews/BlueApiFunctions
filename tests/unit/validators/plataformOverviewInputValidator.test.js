const inputValidator = require('../../../shared/validations/plataformOverviewInputValidator');

describe('On Plataform Overview Input', () => {
  it('should fail to validate when no property is given', () => {
    // Arrange
    const userInput = {};

    const expected = {
      errors: {
        duration: ['The duration field is required.'],
        flowDataDevices: ['The flowDataDevices field is required.'],
        level: ['The level field is required.'],
        maxScore: ['The maxScore field is required.'],
        obstaclesExpFail: ['The obstaclesExpFail field is required.'],
        obstaclesExpSuccess: ['The obstaclesExpSuccess field is required.'],
        obstaclesFail: ['The obstaclesFail field is required.'],
        obstaclesInsFail: ['The obstaclesInsFail field is required.'],
        obstaclesInsSuccess: ['The obstaclesInsSuccess field is required.'],
        obstaclesSpawned: ['The obstaclesSpawned field is required.'],
        obstaclesSuccess: ['The obstaclesSuccess field is required.'],
        pacientId: ['The pacientId field is required.'],
        phase: ['The phase field is required.'],
        playerHp: ['The playerHp field is required.'],
        playFinish: ['The playFinish field is required.'],
        playStart: ['The playStart field is required.'],
        relaxTimeSpawned: ['The relaxTimeSpawned field is required.'],
        result: ['The result field is required.'],
        scoreRatio: ['The scoreRatio field is required.'],
        stageId: ['The stageId field is required.'],
        targetsExpFail: ['The targetsExpFail field is required.'],
        targetsExpSuccess: ['The targetsExpSuccess field is required.'],
        targetsFails: ['The targetsFails field is required.'],
        targetsInsFail: ['The targetsInsFail field is required.'],
        targetsInsSuccess: ['The targetsInsSuccess field is required.'],
        targetsSpawned: ['The targetsSpawned field is required.'],
        targetsSuccess: ['The targetsSuccess field is required.'],
      },
    };

    // Act
    const validationResult = inputValidator.plataformOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(27);
    expect(validationResult.errors).toEqual(expected);
  });

  it('should succeed validation to a valid input', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      playStart: '2020-01-01',
      playFinish: '2020-01-01',
      flowDataDevices: [
        {
          deviceName: 'Pitaco',
          flowData: [
            {
              flowValue: 0,
              timestamp: '2021-01-01',
            },
          ],
        },
      ],
      duration: 0,
      result: 0,
      stageId: 0,
      phase: 0,
      level: 0,
      relaxTimeSpawned: 0,
      maxScore: 0,
      scoreRatio: 0,
      targetsSpawned: 0,
      targetsSuccess: 0,
      targetsInsSuccess: 0,
      targetsExpSuccess: 0,
      targetsFails: 0,
      targetsInsFail: 0,
      targetsExpFail: 0,
      obstaclesSpawned: 0,
      obstaclesSuccess: 0,
      obstaclesInsSuccess: 0,
      obstaclesExpSuccess: 0,
      obstaclesFail: 0,
      obstaclesInsFail: 0,
      obstaclesExpFail: 0,
      playerHp: 0,
    };

    // Act
    const validationResult = inputValidator.plataformOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });

  it.each(['Pitaco', 'Manovacuômetro', 'Cinta'])('should succeed to validate to the given deviceName (%s) in flowDataDevices', (deviceName) => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      flowDataDevices: [
        {
          deviceName,
          flowData: [
            {
              flowValue: 0,
              timestamp: '2021-01-01',
            },
          ],
        },
      ],
      playStart: '2020-01-01',
      playFinish: '2020-01-01',
      duration: 0,
      result: 0,
      stageId: 0,
      phase: 0,
      level: 0,
      relaxTimeSpawned: 0,
      maxScore: 0,
      scoreRatio: 0,
      targetsSpawned: 0,
      targetsSuccess: 0,
      targetsInsSuccess: 0,
      targetsExpSuccess: 0,
      targetsFails: 0,
      targetsInsFail: 0,
      targetsExpFail: 0,
      obstaclesSpawned: 0,
      obstaclesSuccess: 0,
      obstaclesInsSuccess: 0,
      obstaclesExpSuccess: 0,
      obstaclesFail: 0,
      obstaclesInsFail: 0,
      obstaclesExpFail: 0,
      playerHp: 0,
    };

    // Act
    const validationResult = inputValidator.plataformOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });
});
