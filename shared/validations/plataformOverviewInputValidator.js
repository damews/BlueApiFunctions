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