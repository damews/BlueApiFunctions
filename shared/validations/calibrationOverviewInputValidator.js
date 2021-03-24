const Validator = require('validatorjs');

exports.calibrationOverviewSaveValidator = (calibrationOverviewReq) => {
  const rules = {
    pacientId: ['required', 'regex:/^[0-9a-fA-F]{24}$/i'],
    gameDevice: ['required', { in: ['Pitaco', 'Manovacuômetro', 'Cinta'] }],
    calibrationExercise: ['required', { in: ['ExpiratoryPeak', 'InspiratoryPeak', 'ExpiratoryDuration', 'InspiratoryDuration', 'RespiratoryFrequency'] }],
    calibrationValue: 'required|integer',
  };

  const validation = new Validator(calibrationOverviewReq, rules);
  validation.check();

  return validation;
};
