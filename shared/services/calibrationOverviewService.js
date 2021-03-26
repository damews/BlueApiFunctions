module.exports = class CalibrationOverviewService {
  constructor({ calibrationOverviewRepository, playSessionRepository, context }) {
    this.calibrationOverviewRepository = calibrationOverviewRepository;
    this.playSessionRepository = playSessionRepository;
    this.context = context;
  }

  async getCalibrationOverview(filter, gameToken) {
    const findObj = {
      _gameToken: gameToken,
    };

    const options = { sort: { created_at: -1 } };

    if (filter.calibrationId) {
      // eslint-disable-next-line no-underscore-dangle
      findObj._id = filter.calibrationId;
    }
    if (filter.gameDevice) {
      findObj.gameDevice = filter.gameDevice;
    }
    if (filter.calibrationExercise) {
      findObj.calibrationExercise = filter.calibrationExercise;
    }
    if (filter.dataIni) {
      findObj.created_at = {
        $gte: new Date(filter.dataIni).toISOString('yyyy-MM-ddThh:mm:ss.msZ'),
      };
    }
    if (filter.dataIni && filter.dataFim) {
      findObj.created_at = {
        $gte: new Date(`${filter.dataIni} 00:00:00:000 UTC`).toISOString('yyyy-MM-ddThh:mm:ss.msZ'),
        $lte: new Date(`${filter.dataFim} 23:59:59:999 UTC`).toISOString('yyyy-MM-ddThh:mm:ss.msZ'),
      };
    }
    if (filter.limit) { options.limit = parseInt(filter.limit, 10); }
    if (filter.skip) { options.skip = parseInt(filter.skip, 10); }
    if (filter.sort === 'asc') { options.sort = { created_at: 1 }; }

    const result = await this.calibrationOverviewRepository.find(findObj, options);

    return result;
  }

  async getPacientCalibrationOverview(filter, pacientId, gameToken) {
    const findObj = {
      pacientId,
      _gameToken: gameToken,
    };

    const options = { sort: { created_at: -1 } };

    if (filter.gameDevice) { findObj.gameDevice = filter.gameDevice; }
    if (filter.calibrationExercise) { findObj.calibrationExercise = filter.calibrationExercise; }
    if (filter.dataIni) {
      findObj.created_at = {
        $gte: new Date(filter.dataIni).toISOString('yyyy-MM-ddThh:mm:ss.msZ'),
      };
    }
    if (filter.dataIni && filter.dataFim) {
      findObj.created_at = {
        $gte: new Date(`${filter.dataIni} 00:00:00:000 UTC`).toISOString('yyyy-MM-ddThh:mm:ss.msZ'),
        $lte: new Date(`${filter.dataFim} 23:59:59:999 UTC`).toISOString('yyyy-MM-ddThh:mm:ss.msZ'),
      };
    }
    if (filter.limit) { options.limit = parseInt(filter.limit, 10); }
    if (filter.skip) { options.skip = parseInt(filter.skip, 10); }
    if (filter.sort === 'asc') { options.sort = { created_at: 1 }; }

    const result = await this.calibrationOverviewRepository.find(findObj, options);

    return result;
  }

  async create(calibration, gameToken) {
    const pacientSession = await this.playSessionRepository.findOne(
      { pacientId: calibration.pacientId }, { sort: { sessionNumber: -1 } },
    );

    if (!pacientSession) {
      const newPlaySession = {
        pacientId: calibration.pacientId, sessionNumber: 1,
      };
      await this.playSessionRepository.create(newPlaySession);
    } else {
      const pacientSessionDate = new Date(pacientSession.created_at);
      pacientSessionDate.setHours(0, 0, 0, 0);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (pacientSessionDate.getTime() !== currentDate.getTime()) {
        const newPlaySession = {
          pacientId: calibration.pacientId, sessionNumber: pacientSession.sessionNumber + 1,
        };
        this.playSessionRepository.create(newPlaySession);
      }
    }

    const newCalibrationOverview = calibration || {};
    // eslint-disable-next-line no-underscore-dangle
    newCalibrationOverview._gameToken = gameToken;

    const savedCalibrationOverview = (
      this.calibrationOverviewRepository.create(newCalibrationOverview)
    );

    return savedCalibrationOverview;
  }

  async deleteManyByPacientId(pacientId) {
    return this.calibrationOverviewRepository.deleteMany({ pacientId });
  }
};
