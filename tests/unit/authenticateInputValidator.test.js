const inputValidator = require('../../shared/validations/authenticateInputValidator');

describe('On Authenticate', () => {
  it('should fail to validate when no property is given', () => {
    // Arrange
    const userInput = {};

    const expected = {
      errors: {
        username: ['The username field is required.'],
        password: ['The password field is required.'],
      },
    };

    // Act
    const validationResult = inputValidator.authenticateValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(2);
    expect(validationResult.errors).toEqual(expected);
  });

  it('should succeed validation to a valid input', () => {
    // Arrange
    const userInput = {
      username: 'test',
      password: 'test',
    };

    // Act
    const validationResult = inputValidator.authenticateValidator(userInput);

    // Assert
    expect(validationResult.errorCount).toBe(0);
  });
});
