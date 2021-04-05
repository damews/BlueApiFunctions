const Validator = require('validatorjs');

exports.pacientSaveValidator = (pacientReq) => {
  const rules = {
    name: 'required|string',
    sex: ['required', 'string', { in: ['Male', 'Female'] }],
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
    observations: 'required|string',
    condition: ['required', 'string', { in: ['Healthy', 'Obstrutive'] }],
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

  const validation = new Validator(pacientReq, rules);
  validation.check();

  return validation;
};
