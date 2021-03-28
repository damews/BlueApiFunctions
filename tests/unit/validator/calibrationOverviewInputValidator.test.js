const inputValidator = require('../../../shared/validations/calibrationOverviewInputValidator');

describe('On Calibration Overview Input', () => {
  it('should fail to validate when no property is given', () => {
    // Arrange
    const userInput = {};

    const expected = {
      errors: {
        pacientId: ['The pacientId field is required.'],
        gameDevice: ['The gameDevice field is required.'],
        calibrationExercise: ['The calibrationExercise field is required.'],
        calibrationValue: ['The calibrationValue field is required.'],
      },
    };

    // Act
    const validationResult = inputValidator.calibrationOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(4);
    expect(validationResult.errors).toEqual(expected);
  });

  it('should succeed validation to a valid input', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      gameDevice: 'Pitaco',
      calibrationExercise: 'ExpiratoryPeak',
      calibrationValue: 0,
    };

    // Act
    const validationResult = inputValidator.calibrationOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });

  it('should fail to validate when the given gameDevice is not valid', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      gameDevice: 'NotValidGameDevice',
      calibrationExercise: 'ExpiratoryPeak',
      calibrationValue: 0,
    };

    const expected = {
      errors: {
        gameDevice: ['The selected gameDevice is invalid.'],
      },
    };

    // Act
    const validationResult = inputValidator.calibrationOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(1);
    expect(validationResult.errors).toEqual(expected);
  });

  it('should fail to validate when the given calibrationExercise is not valid', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      gameDevice: 'Pitaco',
      calibrationExercise: 'notValidCalibrationExercise',
      calibrationValue: 0,
    };

    const expected = {
      errors: {
        calibrationExercise: ['The selected calibrationExercise is invalid.'],
      },
    };

    // Act
    const validationResult = inputValidator.calibrationOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(1);
    expect(validationResult.errors).toEqual(expected);
  });

  it.each(['Pitaco', 'Manovacuômetro', 'Cinta'])('should succeed to validate to the given gameDevice (%s)', (gameDevice) => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      gameDevice,
      calibrationExercise: 'ExpiratoryPeak', // Using an "default" calibration exercise to test
      calibrationValue: 0,
    };

    // Act
    const validationResult = inputValidator.calibrationOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });

  it.each(['ExpiratoryPeak', 'InspiratoryPeak', 'ExpiratoryDuration', 'InspiratoryDuration', 'RespiratoryFrequency'])('should succeed to validate to the given calibrationExercise (%s)', (calibrationExercise) => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      gameDevice: 'Pitaco', // Using an "default" gameDevice exercise to test
      calibrationExercise,
      calibrationValue: 0,
    };

    // Act
    const validationResult = inputValidator.calibrationOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });

  it('should fail to validate when the given calibrationValue is not valid', () => {
    // Arrange
    const userInput = {
      pacientId: '507f191e810c19729de860ea',
      gameDevice: 'Pitaco',
      calibrationExercise: 'ExpiratoryPeak',
      calibrationValue: 'a',
    };

    const expected = {
      errors: {
        calibrationValue: ['The calibrationValue must be an integer.'],
      },
    };

    // Act
    const validationResult = inputValidator.calibrationOverviewSaveValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(1);
    expect(validationResult.errors).toEqual(expected);
  });
});
