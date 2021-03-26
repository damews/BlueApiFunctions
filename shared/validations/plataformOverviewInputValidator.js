const Validator = require('validatorjs');

exports.plataformOverviewSaveValidator = (plataformOverviewReq) => {
  const rules = {
    pacientId: ['required', 'regex:/^[0-9a-fA-F]{24}$/i'],
    flowDataDevices: 'required',
    'flowDataDevices.*.deviceName': ['required', { in: ['Pitaco', 'Manovacuômetro', 'Cinta'] }],
    'flowDataDevices.*.flowData.*.flowValue': 'numeric',
    'flowDataDevices.*.flowData.*.timestamp': 'date',
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
    targetsSuccess: 'required|integer',
    targetsInsuccess: 'required|integer',
    targetsExpSuccess: 'required|integer',
    targetsFails: 'required|integer',
    targetsInsFail: 'required|integer',
    targetsExpFail: 'required|integer',
    obstaclesSpawned: 'required|integer',
    obstaclesSuccess: 'required|integer',
    obstaclesInsSuccess: 'required|integer',
    obstaclesExpSuccess: 'required|integer',
    obstaclesFail: 'required|integer',
    obstaclesInsFail: 'required|integer',
    obstaclesExpFail: 'required|integer',
    playerHp: 'required|numeric',
  };

  const validation = new Validator(plataformOverviewReq, rules);
  validation.check();
  return validation;
};
