const inputValidator = require('../../shared/validations/tokenCreateInputValidator');

describe('On Token Creation', () => {

    it('should fail to validate when no property is given', () => {

        //Arrange
        let userInput = {};

        let expected = {
            errors: {
                userId: ["The userId field is required."]
            }
        };

        //Act
        let validationResult = inputValidator.createTokenValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should succeed to validate to an valid input', () => {

        //Arrange
        let userInput = {
            userId: "507f191e810c19729de860ea",
        };

        //Act
        let validationResult = inputValidator.createTokenValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(0);

    });

    it('should fail validation when the userId property is not valid', () => {

        //Arrange
        let userInput = {
            userId: "123abc",
        };

        let expected = {
            errors: {
                userId: ["The userId format is invalid."]
            }
        };

        //Act
        let validationResult = inputValidator.createTokenValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

});

