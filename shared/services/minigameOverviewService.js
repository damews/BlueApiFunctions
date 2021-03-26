module.exports = class MinigameOverviewService {
  constructor({
    minigameOverviewRepository,
    pacientRepository,
    flowDataDeviceRepository,
    playSessionRepository,
    context,
  } = {}) {
    this.minigameOverviewRepository = minigameOverviewRepository;
    this.pacientRepository = pacientRepository;
    this.flowDataDeviceRepository = flowDataDeviceRepository;
    this.playSessionRepository = playSessionRepository;
    this.context = context;
  }

  async getMinigameOverview(filter, gameToken) {
    const findObj = {
      _gameToken: gameToken,
    };

    const options = { sort: { created_at: -1 } };

    // eslint-disable-next-line no-underscore-dangle
    if (filter.minigameOverviewId) { findObj._id = filter.minigameOverviewId; }
    if (filter.minigameName) { findObj.minigameName = filter.minigameName; }
    if (filter.devices) {
      const devicesSearch = filter.devices.split(',');
      findObj.devices = { $in: devicesSearch };
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

    const result = await this.minigameOverviewRepository.find(findObj, options);

    return result;
  }

  async getPacientMinigameOverview(filter, pacientId, gameToken) {
    const findObj = {
      pacientId,
      _gameToken: gameToken,
    };

    const options = { sort: { created_at: -1 } };

    if (filter.minigameName) { findObj.minigameName = filter.minigameName; }
    if (filter.devices) {
      const devicesSearch = filter.devices.split(',');
      findObj.devices = { $in: devicesSearch };
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

    const result = await this.minigameOverviewRepository.find(findObj, options);

    return result;
  }

  async create(minigameOverview, gameToken) {
    const newMinigameOverview = { ...minigameOverview } || {};
    // eslint-disable-next-line no-underscore-dangle
    newMinigameOverview._gameToken = gameToken;
    newMinigameOverview.flowDataRounds = [];

    const flowDataDevicesIds = [];

    const flowDataDevicesObjects = minigameOverview.flowDataRounds.map((x) => x.flowDataDevices);

    const devices = flowDataDevicesObjects[0].map((x) => x.deviceName);

    const saveFlowDataDevices = async () => {
      flowDataDevicesObjects.forEach(async (flowDataDevices) => {
        const newFlowDataDevice = { _gameToken: gameToken, flowDataDevices };
        const savedFlowDataDevices = await this.flowDataDeviceRepository.create(newFlowDataDevice);
        // eslint-disable-next-line no-underscore-dangle
        flowDataDevicesIds.push(savedFlowDataDevices._id);
      });
    };

    await saveFlowDataDevices();

    newMinigameOverview.flowDataRounds.push({ flowDataDevicesId: flowDataDevicesIds[0] });
    newMinigameOverview.flowDataRounds.push({ flowDataDevicesId: flowDataDevicesIds[1] });
    newMinigameOverview.flowDataRounds.push({ flowDataDevicesId: flowDataDevicesIds[2] });
    newMinigameOverview.devices = devices;

    const pacientSession = await this.playSessionRepository.findOne(
      {
        pacientId: minigameOverview.pacientId,
      },
      {
        sort: { sessionNumber: -1 },
      },
    );

    if (!pacientSession) {
      const newPlaySession = { pacientId: minigameOverview.pacientId, sessionNumber: 1 };
      await this.playSessionRepository.create(newPlaySession);
    } else {
      const pacientSessionDate = new Date(pacientSession.created_at);
      pacientSessionDate.setHours(0, 0, 0, 0);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (pacientSessionDate.getTime() !== currentDate.getTime()) {
        const newPlaySession = ({
          pacientId: minigameOverview.pacientId,
          sessionNumber: pacientSession.sessionNumber + 1,
        });
        await this.playSessionRepository.create(newPlaySession);
      }
    }

    const result = await this.minigameOverviewRepository.create(newMinigameOverview);

    return result;
  }

  async deleteManyByPacientId(pacientId) {
    return this.accountRepository.deleteMany({ pacientId });
  }
};
