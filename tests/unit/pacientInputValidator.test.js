const inputValidator = require('../../shared/validations/pacientInputValidator');

describe('On Pacient Input', () => {

    it('should fail to validate when no property is given', () => {

        //Arrange
        let userInput = {};

        let expected = {
            errors: {
                accumulatedScore: ['The accumulatedScore field is required.'],
                birthday: ['The birthday field is required.'],
                calibrationCintaDone: ['The calibrationCintaDone field is required.'],
                calibrationManoDone: ['The calibrationManoDone field is required.'],
                calibrationPitacoDone: ['The calibrationPitacoDone field is required.'],
                'capacitiesCinta.expFlowDuration': ['The capacitiesCinta.expFlowDuration field is required.'],
                'capacitiesCinta.expPeakFlow': ['The capacitiesCinta.expPeakFlow field is required.'],
                'capacitiesCinta.insFlowDuration': ['The capacitiesCinta.insFlowDuration field is required.'],
                'capacitiesCinta.insPeakFlow': ['The capacitiesCinta.insPeakFlow field is required.'],
                'capacitiesCinta.respiratoryRate': ['The capacitiesCinta.respiratoryRate field is required.'],
                'capacitiesMano.expFlowDuration': ['The capacitiesMano.expFlowDuration field is required.'],
                'capacitiesMano.expPeakFlow': ['The capacitiesMano.expPeakFlow field is required.'],
                'capacitiesMano.insFlowDuration': ['The capacitiesMano.insFlowDuration field is required.'],
                'capacitiesMano.insPeakFlow': ['The capacitiesMano.insPeakFlow field is required.'],
                'capacitiesMano.respiratoryRate': ['The capacitiesMano.respiratoryRate field is required.'],
                'capacitiesPitaco.expFlowDuration': ['The capacitiesPitaco.expFlowDuration field is required.'],
                'capacitiesPitaco.expPeakFlow': ['The capacitiesPitaco.expPeakFlow field is required.'],
                'capacitiesPitaco.insFlowDuration': ['The capacitiesPitaco.insFlowDuration field is required.'],
                'capacitiesPitaco.insPeakFlow': ['The capacitiesPitaco.insPeakFlow field is required.'],
                'capacitiesPitaco.respiratoryRate': ['The capacitiesPitaco.respiratoryRate field is required.'],
                cintaThreshold: ['The cintaThreshold field is required.'],
                condition: ['The condition field is required.'],
                ethnicity: ['The ethnicity field is required.'],
                height: ['The height field is required.'],
                howToPlayDone: ['The howToPlayDone field is required.'],
                manoThreshold: ['The manoThreshold field is required.'],
                name: ['The name field is required.'],
                pitacoThreshold: ['The pitacoThreshold field is required.'],
                playSessionsDone: ['The playSessionsDone field is required.'],
                sex: ['The sex field is required.'],
                unlockedLevels: ['The unlockedLevels field is required.'],
                weight: ['The weight field is required.']
            }
        };

        //Act
        let validationResult = inputValidator.pacientSaveValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(32);
        expect(validationResult.errors).toEqual(expected);

    });

    it('should succeed validation to a valid input', () => {

        //Arrange
        let userInput = {
            name: 'Teste',
            sex: 'Male',
            birthday: '2020-01-01',
            capacitiesPitaco: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            capacitiesMano: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            capacitiesCinta: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            condition: 'Healthy',
            unlockedLevels: '0',
            accumulatedScore: '0',
            playSessionsDone: '0',
            calibrationPitacoDone: false,
            calibrationManoDone: false,
            calibrationCintaDone: false,
            howToPlayDone: false,
            weight: 85,
            height: 180,
            pitacoThreshold: 0,
            manoThreshold: 0,
            cintaThreshold: 0,
            ethnicity: 'Test',
        };

        //Act
        let validationResult = inputValidator.pacientSaveValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(0);

    });

    it.each(['Male', 'Female'])('should succeed to validate to the given sex (%s)', (sex) => {

        //Arrange
        let userInput = {
            name: 'Teste',
            sex: sex,
            birthday: '2020-01-01',
            capacitiesPitaco: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            capacitiesMano: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            capacitiesCinta: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            condition: 'Healthy',
            unlockedLevels: '0',
            accumulatedScore: '0',
            playSessionsDone: '0',
            calibrationPitacoDone: false,
            calibrationManoDone: false,
            calibrationCintaDone: false,
            howToPlayDone: false,
            weight: 85,
            height: 180,
            pitacoThreshold: 0,
            manoThreshold: 0,
            cintaThreshold: 0,
            ethnicity: 'Test',
        };

        //Act
        let validationResult = inputValidator.pacientSaveValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(0);

    });

    it.each(['Healthy', 'Obstrutive'])('should succeed to validate to the given condition (%s)', (condition) => {

        //Arrange
        let userInput = {
            name: 'Teste',
            sex: 'Male',
            birthday: '2020-01-01',
            capacitiesPitaco: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            capacitiesMano: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            capacitiesCinta: {
                insPeakFlow: '1',
                expPeakFlow: '1',
                insFlowDuration: '1',
                expFlowDuration: '1',
                respiratoryRate: '1',
            },
            condition: condition,
            unlockedLevels: '0',
            accumulatedScore: '0',
            playSessionsDone: '0',
            calibrationPitacoDone: false,
            calibrationManoDone: false,
            calibrationCintaDone: false,
            howToPlayDone: false,
            weight: 85,
            height: 180,
            pitacoThreshold: 0,
            manoThreshold: 0,
            cintaThreshold: 0,
            ethnicity: 'Test',
        };

        //Act
        let validationResult = inputValidator.pacientSaveValidator(userInput);

        //Assert
        expect(validationResult.errorCount).toBe(0);

    });

});

