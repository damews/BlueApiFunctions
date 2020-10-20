const Validator = require('validatorjs');

exports.plataformOverviewSaveValidator = (plataformOverviewReq) => {
    let rules = {
        pacientId: ['required', 'regex:/^[0-9a-fA-F]{24}$/i'],
        'flowDataDevices.*.deviceName': ['required', {'in': ['Pitaco', 'Manovacuômetro', 'Cinta']}],
        'flowDataDevices.*.flowData.*.flowValue': 'required|numeric',
        'flowDataDevices.*.flowData.*.timestamp': 'required|date',
        playStart: 'required|date',
        playFinish: 'required|date',
        duration: 'required|numeric',
        result: 'required|numeric',
        stageId: 'required|integer',
        phase: 'required|integer',
        level: 'required|numeric',
        relaxTimeSpawned: 'required|numeric',
        maxScore: 'required|numeric',
        scoreRatio: 'required|numeric',
        targetsSpawned: 'required|integer',
        TargetsSuccess: 'required|integer',
        TargetsInsuccess: 'required|integer',
        TargetsExpSuccess: 'required|integer',
        TargetsFails: 'required|integer',
        TargetsInsFail: 'required|integer',
        TargetsExpFail: 'required|integer',
        ObstaclesSpawned: 'required|integer',
        ObstaclesSuccess: 'required|integer',
        ObstaclesInsSuccess: 'required|integer',
        ObstaclesExpSuccess: 'required|integer',
        ObstaclesFail: 'required|integer',
        ObstaclesInsFail: 'required|integer',
        ObstaclesExpFail: 'required|integer',
        PlayerHp: 'required|numeric',
    };

    let validation = new Validator(plataformOverviewReq, rules);
    validation.check();
    return validation;
}

exports.pacientSaveValidator = (pacientReq) => {

    pacientReq.birthday = pacientReq.birthday.replace(new RegExp('/', 'g'), '-');

    let rules = {
        name: 'required|string',
        sex: ['required', 'string', { 'in': ["Male", "Female"] }],
        birthday: 'required|date',
        capacitiesPitaco: {
            insPeakFlow: 'required|integer',
            expPeakFlow: 'required|integer',
            insFlowDuration: 'required|integer',
            expFlowDuration: 'required|integer',
            respiratoryRate: 'required|integer',
        },
        capacitiesMano: {
            insPeakFlow: 'required|integer',
            expPeakFlow: 'required|integer',
            insFlowDuration: 'required|integer',
            expFlowDuration: 'required|integer',
            respiratoryRate: 'required|integer',
        },
        capacitiesCinta: {
            insPeakFlow: 'required|integer',
            expPeakFlow: 'required|integer',
            insFlowDuration: 'required|integer',
            expFlowDuration: 'required|integer',
            respiratoryRate: 'required|integer',
        },
        condition: ['required', 'string', { 'in': ["Healthy", "Obstrutive"] }],
        unlockedLevels: 'required|integer',
        accumulatedScore: 'required|integer',
        playSessionsDone: 'required|integer',
        calibrationPitacoDone: 'required|boolean',
        calibrationManoDone: 'required|boolean',
        calibrationCintaDone: 'required|boolean',
        howToPlayDone: 'required|boolean',
        weight: 'required|integer',
        height: 'required|integer',
        pitacoThreshold: 'required|numeric',
        manoThreshold: 'required|numeric',
        cintaThreshold: 'required|numeric',
        ethnicity: 'required|string',
    };

    let validation = new Validator(pacientReq, rules);
    validation.check();

    return validation;
}

exports.minigameOverviewSaveValidator = (minigameOverviewReq) => {

    let rules = {
        pacientId: ['required', 'regex:/^[0-9a-fA-F]{24}$/i'],
        minigameName: ['required', {'in': ['CakeGame', 'WaterGame']}],
        respiratoryExercise: ['required', {'in': ['ExpiratoryPeak', 'InspiratoryPeak']}],
        'flowDataRounds.*.minigameRound': 'required|integer',
        'flowDataRounds.*.roundScore': 'required|integer',
        'flowDataRounds.*.roundFlowScore': 'required|numeric',
        'flowDataRounds.*.flowDataDevices.*.deviceName': ['required', {'in': ['Pitaco', 'Manovacuômetro', 'Cinta']}],
        'flowDataRounds.*.flowDataDevices.*.flowData.*.flowValue': 'required|numeric',
        'flowDataRounds.*.flowDataDevices.*.flowData.*.timestamp': 'required|date',
    };

    let validation = new Validator(minigameOverviewReq, rules);
    validation.check();

    return validation;
}

exports.calibrationOverviewSaveValidator = (calibrationOverviewReq) => {

    let rules = {
        pacientId: ['required', 'regex:/^[0-9a-fA-F]{24}$/i'],
        gameDevice: ['required', {'in': ['Pitaco', 'Manovacuômetro', 'Cinta']}],
        calibrationExercise: ['required', {'in': ['ExpiratoryPeak', 'InspiratoryPeak', 'ExpiratoryDuration', 'InspiratoryDuration', 'RespiratoryFrequency']}],
        calibrationValue: 'required|integer'
    };

    let validation = new Validator(calibrationOverviewReq, rules);
    validation.check();

    return validation;
}

exports.createTokenValidator = (createTokenReq) => {

    let rules = {
        userId: ['required', 'regex:^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$']
    };

    let validation = new Validator(createTokenReq, rules);
    validation.check();

    return validation;
}

exports.createUserValidator = (createTokenReq) => {

    let rules = {
        fullname: 'required|string',
        username: 'required|string',
        password: 'required|string',
        email: 'required|email',
        role: ['required', {'in': ['Administrator', 'User']}],
        pacientId: [{required_if: ['role', 'User']}, 'regex:/^[0-9a-fA-F]{24}$/i'],
    };

    let validation = new Validator(createTokenReq, rules);
    validation.check();

    return validation;
}

exports.authenticateValidator = (authenticateReq) => {

    let rules = {
        username: 'required|string',
        password: 'required|string'
    };

    let validation = new Validator(authenticateReq, rules);
    validation.check();

    return validation;
}
