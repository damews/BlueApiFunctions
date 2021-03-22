const inputValidator = require('../../shared/validations/accountCreateInputValidator');

describe('On Account Creation', () => {

    it('should fail to validate when no property is given', () => {

        //Arrange
        let userInput = {};

        let expected = {
            errors: {
                email: ["The email field is required."],
                fullname: ["The fullname field is required."],
                password: ["The password field is required."],
                role: ["The role field is required."],
                username: ["The username field is required."]
            }
        };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(5);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should succeed to validate to an valid input with the role User', () => {

        //Arrange
        let userInput = {
            email: "email@email.com",
            fullname: "Fullname",
            username: "Username",
            password: "Password",
            role: "User",
            pacientId: "507f191e810c19729de860ea",
        };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(0);

    });

    it('should succeed to validate to an valid input with the role Adminstrator', () => {

        //Arrange
        let userInput = {
            email: "email@email.com",
            fullname: "Fullname",
            username: "Username",
            password: "Password",
            role: "Administrator",
        };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(0);

    });

    it('should fail to validate when email is not on a valid format', () => {

        //Arrange
        let userInput = {
            fullname: "test",
            username: "test",
            password: "test123",
            email: "this_email_is_wrong!",
            role: "Administrator"
        };

        let expected = { errors: { email: ["The email format is invalid."] } };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should fail to validate when fullname is not given', () => {

        //Arrange
        let userInput = {
            username: "test",
            password: "test123",
            email: "test@gmail.com",
            role: "Administrator"
        };

        let expected = { errors: { fullname: ["The fullname field is required."] } };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should fail to validate when role is not given', () => {

        //Arrange
        let userInput = {
            fullname: "test",
            username: "test",
            password: "test123",
            email: "test@gmail.com"
        };

        let expected = { errors: { role: ["The role field is required."] } };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

    it.each([{ role: "Administrator", expectedErrors: 0 }, { role: "User", expectedErrors: 1 }])('should succeed to validate to the given role (%o) and expect the number of errors', (obj) => {

        //Arrange
        let userInput = {
            fullname: "test",
            username: "test",
            password: "test123",
            email: "test@gmail.com",
            role: obj.role
        };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(obj.expectedErrors);

    });

    it('should fail to validate when the given role is not valid', () => {

        //Arrange
        let userInput = {
            fullname: "test",
            username: "test",
            password: "test123",
            email: "test@gmail.com",
            role: "Not a valid role!"
        };

        let expected = { errors: { role: ["The selected role is invalid."] } };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should fail to validate when the given role is User but the pacientId is not given', () => {

        //Arrange
        let userInput = {
            fullname: "test",
            username: "test",
            password: "test123",
            email: "test@gmail.com",
            role: "User",
        };

        let expected = { errors: { pacientId: ["The pacientId field is required when role is User."] } };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should fail to validate when the given role is User but the pacientId is not on a valid format', () => {

        //Arrange
        let userInput = {
            fullname: "test",
            username: "test",
            password: "test123",
            email: "test@gmail.com",
            role: "User",
            pacientId: "123ABC"
        };

        let expected = { errors: { pacientId: ["The pacientId format is invalid."] } };

        //Act
        let validationResult = inputValidator.createUserValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(1);
        expect(validationResult.errors).toEqual(expected);

    });

});

