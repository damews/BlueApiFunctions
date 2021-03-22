const Validator = require('validatorjs');

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