const inputValidator = require('../../shared/validations/authenticateInputValidator');

describe('On Authenticate', () => {

    it('should fail to validate when no property is given', () => {

        //Arrange
        let userInput = {};

        let expected = {
            errors: {
                username: ["The username field is required."],
                password: ["The password field is required."],
            }
        };

        //Act
        let validationResult = inputValidator.authenticateValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(2);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should succeed validation to a valid input', () => {

        //Arrange
        let userInput = {
            username: "test",
            password: "test",
        };

        //Act
        let validationResult = inputValidator.authenticateValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(0);

    });

});

