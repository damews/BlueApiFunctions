const inputValidator = require('../../shared/validations/minigameOverviewInputValidator');

describe('On Calibration Overview Input', () => {
  it('should fail to validate when no property is given', () => {
    // Arrange
    const userInput = {};

    const expected = {
      errors: {
        pacientId: ['The pacientId field is required.'],
        minigameName: ['The minigameName field is required.'],
        respiratoryExercise: ['The respiratoryExercise field is required.'],
        flowDataRounds: ['The flowDataRounds field is required.'],
      },
    };

    // Act
    const validationResult = inputValidator.minigameOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(4);
    expect(validationResult.errors).toEqual(expected);
  });

  it('should succeed validation to a valid input', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      minigameName: 'CakeGame',
      respiratoryExercise: 'ExpiratoryPeak',
      flowDataRounds: [
        {
          minigameRound: 1,
          roundScore: 1,
          roundFlowScore: 1,
          flowDataDevices: [
            {
              deviceName: 'Pitaco',
              flowData: [
                {
                  flowValue: 1,
                  timestamp: new Date(),
                },
              ],
            },
          ],
        },
      ],
    };

    // Act
    const validationResult = inputValidator.minigameOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });

  it('should fail to validate when the given pacientId is invalid', () => {
    // Arrange
    const userInput = {
      pacientId: 'abc123',
      minigameName: 'CakeGame',
      respiratoryExercise: 'ExpiratoryPeak',
      flowDataRounds: [
        {
          minigameRound: 1,
          roundScore: 1,
          roundFlowScore: 1,
          flowDataDevices: [
            {
              deviceName: 'Pitaco',
              flowData: [
                {
                  flowValue: 1,
                  timestamp: new Date(),
                },
              ],
            },
          ],
        },
      ],
    };

    const expected = {
      errors: {
        pacientId: ['The pacientId format is invalid.'],
      },
    };

    // Act
    const validationResult = inputValidator.minigameOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(1);
    expect(validationResult.errors).toEqual(expected);
  });

  it('should fail to validate when the given deviceName in flowDataDevices is invalid', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      minigameName: 'CakeGame',
      respiratoryExercise: 'ExpiratoryPeak',
      flowDataRounds: [
        {
          minigameRound: 1,
          roundScore: 1,
          roundFlowScore: 1,
          flowDataDevices: [
            {
              deviceName: 'Invalid_Device_Name',
              flowData: [
                {
                  flowValue: 1,
                  timestamp: new Date(),
                },
              ],
            },
          ],
        },
      ],
    };

    const expected = {
      errors: {
        'flowDataRounds.0.flowDataDevices.0.deviceName': ['The selected flowDataRounds.0.flowDataDevices.0.deviceName is invalid.'],
      },
    };

    // Act
    const validationResult = inputValidator.minigameOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(1);
    expect(validationResult.errors).toEqual(expected);
  });

  it('should fail to validate on a child property is not given', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      minigameName: 'CakeGame',
      respiratoryExercise: 'ExpiratoryPeak',
      flowDataRounds: [
        {
          minigameRound: 1,
          roundScore: 1,
          roundFlowScore: 1,
          flowDataDevices: [
            {
              flowData: [
                {
                  timestamp: new Date(),
                },
              ],
            },
          ],
        },
      ],
    };

    const expected = {
      errors: {
        'flowDataRounds.0.flowDataDevices.0.deviceName': ['The flowDataRounds.0.flowDataDevices.0.deviceName field is required.'],
        'flowDataRounds.0.flowDataDevices.0.flowData.0.flowValue': ['The flowDataRounds.0.flowDataDevices.0.flowData.0.flowValue field is required.'],
      },
    };

    // Act
    const validationResult = inputValidator.minigameOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(2);
    expect(validationResult.errors).toEqual(expected);
  });

  it.each(['CakeGame', 'WaterGame'])('should succeed to validate to the given minigameName (%s)', (minigameName) => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      minigameName,
      respiratoryExercise: 'ExpiratoryPeak',
      flowDataRounds: [
        {
          minigameRound: 1,
          roundScore: 1,
          roundFlowScore: 1,
          flowDataDevicesId: '507f191e810c19729de860ea',
        },
      ],
    };

    // Act
    const validationResult = inputValidator.minigameOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });

  it.each(['ExpiratoryPeak', 'InspiratoryPeak'])('should succeed to validate to the given respiratoryExercise (%s)', (respiratoryExercise) => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      minigameName: 'CakeGame',
      respiratoryExercise,
      flowDataRounds: [
        {
          minigameRound: 1,
          roundScore: 1,
          roundFlowScore: 1,
          flowDataDevicesId: '507f191e810c19729de860ea',
        },
      ],
    };

    // Act
    const validationResult = inputValidator.minigameOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });
});
