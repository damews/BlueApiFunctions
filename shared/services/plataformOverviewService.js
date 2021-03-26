module.exports = class PlataformOverviewService {
  constructor({
    plataformOverviewRepository,
    playSessionRepository,
    flowDataDeviceRepository,
    context,
  } = {}) {
    this.plataformOverviewRepository = plataformOverviewRepository;
    this.playSessionRepository = playSessionRepository;
    this.flowDataDeviceRepository = flowDataDeviceRepository;
    this.context = context;
  }

  async getPacientPlataformOverviewStatistics(filter, pacientId) {
    const aggregate = this.plataformOverviewRepository.getAggregate();

    const matchOperators = { $match: { pacientId } };
    let deviceNameMatch = '';

    if (filter.phase) { matchOperators.$match.phase = filter.phase; }
    if (filter.level) { matchOperators.$match.level = filter.level; }
    if (filter.devices) { deviceNameMatch = filter.devices; }
    if (filter.dataIni) {
      matchOperators.$match.created_at = {
        $gte: new Date(new Date(`${filter.dataIni} 00:00:00:000`).toISOString()),
      };
    }
    if (filter.dataIni && filter.dataFim) {
      matchOperators.$match.created_at = {
        $gte: new Date(new Date(`${filter.dataIni} 00:00:00:000`).toISOString()),
        $lte: new Date(new Date(`${filter.dataFim} 23:59:59:999`).toISOString()),
      };
    }

    aggregate.append(matchOperators);

    if (filter.sort === 'asc') { aggregate.sort({ created_at: 1 }); }

    aggregate.lookup({
      from: 'flowdatadevices',
      let: { flowDataDeviceId: '$flowDataDevicesId' },
      localField: '',
      pipeline: [
        {
          $match:
          {
            $expr: { $eq: ['$_id', '$$flowDataDeviceId'] },
          },
        },
        { $project: { flowDataDevices: 1 } },
      ],
      as: 'flowData',
    });

    aggregate.replaceRoot({ newRoot: { $mergeObjects: [{ $arrayElemAt: ['$flowData', 0] }, '$$ROOT'] } });
    aggregate.unwind('$newRoot');
    aggregate.project({ 'newRoot.flowData': 0 });
    aggregate.unwind('$newRoot.flowDataDevices');
    if (deviceNameMatch !== '') { aggregate.match({ 'newRoot.flowDataDevices.deviceName': deviceNameMatch }); }
    aggregate.project({
      created_at:
      {
        $dateToString:
        {
          format: '%d/%m/%Y', date: '$newRoot.created_at',
        },
      },
      pacientId: '$newRoot.pacientId',
      flowDataDevicesId: '$newRoot.flowDataDevicesId',
      deviceName: '$newRoot.flowDataDevices.deviceName',
      playStart: '$newRoot.playStart',
      playFinish: '$newRoot.playFinish',
      duration: '$newRoot.duration',
      result: '$newRoot.result',
      stageId: '$newRoot.stageId',
      phase: '$newRoot.phase',
      level: '$newRoot.level',
      relaxTimeSpawned: '$newRoot.relaxTimeSpawned',
      maxScore: '$newRoot.maxScore',
      scoreRatio: '$newRoot.scoreRatio',
      targetsSpawned: '$newRoot.targetsSpawned',
      targetsExpSuccess: '$newRoot.TargetsExpSuccess',
      targetsFails: '$newRoot.TargetsFails',
      targetsInsFail: '$newRoot.TargetsInsFail',
      targetsExpFail: '$newRoot.TargetsExpFail',
      obstaclesSpawned: '$newRoot.ObstaclesSpawned',
      obstaclesSuccess: '$newRoot.ObstaclesSuccess',
      obstaclesFail: '$newRoot.ObstaclesFail',
      obstaclesInsSuccess: '$newRoot.ObstaclesInsSuccess',
      obstaclesExpSuccess: '$newRoot.ObstaclesExpSuccess',
      obstaclesInsFail: '$newRoot.ObstaclesInsFail',
      obstaclesExpFail: '$newRoot.ObstaclesExpFail',
      playerHp: '$newRoot.PlayerHp',
      maxInsFlow:
      {
        $min:
        {
          $map:
          {
            input: '$newRoot.flowDataDevices.flowData',
            as: 'flowData',
            in: '$$flowData.flowValue',
          },
        },
      },
      maxExpFlow:
      {
        $max:
        {
          $map:
          {
            input: '$newRoot.flowDataDevices.flowData',
            as: 'flowData',
            in: '$$flowData.flowValue',
          },
        },
      },
    });

    if (filter.limit) { aggregate.limit(filter.limit); }
    if (filter.skip) { aggregate.skip(filter.skip); }

    const results = await aggregate.exec();

    return results;
  }

  async getPacientPlataformOverview(filter, pacientId, gameToken) {
    const findObj = {
      pacientId,
      _gameToken: gameToken,
    };

    const options = { sort: { created_at: -1 } };

    if (filter.phase) { findObj.phase = filter.phase; }
    if (filter.level) { findObj.level = filter.level; }
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

    const result = await this.plataformOverviewRepository.find(findObj, options);

    return result;
  }

  async getPlataformOverview(filter, gameToken) {
    const findObj = {
      _gameToken: gameToken,
    };

    const options = { sort: { created_at: -1 } };

    // eslint-disable-next-line no-underscore-dangle
    if (filter.plataformOverviewId) { findObj._id = filter.plataformOverviewId; }
    if (filter.phase) { findObj.phase = filter.phase; }
    if (filter.level) { findObj.level = filter.level; }
    if (filter.gameDevice) { findObj.gameDevice = filter.gameDevice; }
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

    const results = await this.plataformOverviewRepository.find(findObj, options);

    return results;
  }

  async getPlataformOverviewStatistics(filter) {
    const aggregate = this.plataformOverviewRepository.getAggregate();

    const pacientsMatchOperators = { $match: {} };
    const plataformMathOperators = { $match: {} };
    let maxSessions = Number.MAX_SAFE_INTEGER;
    let deviceName = 'Pitaco';

    if (filter.condition) { pacientsMatchOperators.$match.condition = filter.condition; }
    if (filter.sex) { pacientsMatchOperators.$match.sex = filter.sex; }
    if (filter.fromBirthday) {
      pacientsMatchOperators.$match.birthday = {
        $gte: new Date(new Date(`${filter.fromBirthday} 00:00:00:000`).toISOString()),
      };
    }
    if (filter.fromBirthday && filter.toBirthday) {
      pacientsMatchOperators.$match.birthday = {
        $gte: new Date(new Date(`${filter.fromBirthday} 00:00:00:000`).toISOString()),
        $lte: new Date(new Date(`${filter.toBirthday} 23:59:59:999`).toISOString()),
      };
    }

    if (filter.maxSessions) { maxSessions = filter.maxSessions; }

    if (filter.phase) { plataformMathOperators.$match.phase = filter.phase; }
    if (filter.level) { plataformMathOperators.$match.level = filter.level; }

    if (filter.devices) { deviceName = filter.devices; }

    aggregate.append(pacientsMatchOperators);
    aggregate.project({ _id: 1 });
    aggregate.lookup({
      from: 'playsessions',
      let: {
        id: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $toObjectId: '$pacientId' }, '$$id'] },
                { $lte: ['$sessionNumber', maxSessions] },
              ],
            },
          },
        },
        {
          $project: {
            day: { $dayOfMonth: { date: '$created_at' } },
            month: { $month: { date: '$created_at' } },
            year: { $year: { date: '$created_at' } },
            created_at: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
            sessionNumber: 1,
          },
        },
      ],
      as: 'playsessions',
    });

    aggregate.lookup({
      from: 'plataformoverviews',
      let: {
        id: '$_id',
        startDate: {
          $arrayElemAt: [
            '$playsessions',
            0,
          ],
        },
        endDate: {
          $arrayElemAt: [
            '$playsessions',
            -1,
          ],
        },
      },
      pipeline: [
        {
          $addFields: {
            p: {
              $toObjectId: '$pacientId',
            },
          },
        },
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    '$p',
                    '$$id',
                  ],
                },
                {
                  $gte: [
                    '$created_at',
                    {
                      $dateFromParts: {
                        year: '$$startDate.year', month: '$$startDate.month', day: '$$startDate.day', hour: 0, minute: 0, second: 0, millisecond: 0,
                      },
                    },
                  ],
                },
                {
                  $lte: [
                    '$created_at',
                    {
                      $dateFromParts: {
                        year: '$$endDate.year', month: '$$endDate.month', day: '$$endDate.day', hour: 23, minute: 59, second: 59, millisecond: 999,
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $project: {
            flowDataDevicesId: 1,
            created_at: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$created_at',
              },
            },
            maxScore: 1,
            scoreRatio: 1,
          },
        },
      ],
      as: 'plataform',
    });

    aggregate.unwind({ path: '$plataform' });
    aggregate.project({
      plataformId: '$plataform._id',
      flowDataDevicesId: '$plataform.flowDataDevicesId',
      created_at: '$plataform.created_at',
      session: {
        $arrayElemAt: [{
          $filter: {
            input: '$playsessions',
            as: 'playSessions',
            cond: { $eq: ['$$playSessions.created_at', '$plataform.created_at'] },
          },
        }, 0],
      },
      plataformScore: '$plataform.maxScore',
      plataformScoreRatio: '$plataform.scoreRatio',
    });
    aggregate.lookup({
      from: 'flowdatadevices',
      let: {
        flowDataDeviceId: '$flowDataDevicesId',
      },
      localField: '',
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: [
                '$_id',
                '$$flowDataDeviceId',
              ],
            },
          },
        },
        { $project: { flowDataDevices: 1 } },
      ],
      as: 'flowData',
    });

    aggregate.replaceRoot({ newRoot: { $mergeObjects: [{ $arrayElemAt: ['$flowData', 0] }, '$$ROOT'] } });
    aggregate.unwind('$newRoot');
    aggregate.project({ 'newRoot.flowData': 0 });
    aggregate.unwind('$newRoot.flowDataDevices');
    aggregate.match({ 'newRoot.flowDataDevices.deviceName': deviceName });
    aggregate.project({
      sessionNumber: '$newRoot.session.sessionNumber',
      pacientId: '$newRoot._id',
      created_at: '$newRoot.created_at',
      maxInsFlow: {
        $min: {
          $map: {
            input: '$newRoot.flowDataDevices.flowData',
            as: 'flowData',
            in: '$$flowData.flowValue',
          },
        },
      },
      maxExpFlow: {
        $max: {
          $map: {
            input: '$newRoot.flowDataDevices.flowData',
            as: 'flowData',
            in: '$$flowData.flowValue',
          },
        },
      },
      plataformScore: '$newRoot.plataformScore',
      plataformScoreRatio: '$newRoot.plataformScoreRatio',
    });
    aggregate.group({
      _id: { pacientId: '$pacientId', date: '$created_at', sessionNumber: '$sessionNumber' },
      maxExpFlow: { $max: '$maxExpFlow' },
      maxInsFlow: { $min: '$maxInsFlow' },
      maxScore: { $max: '$plataformScore' },
      maxScoreRatio: { $max: '$plataformScoreRatio' },
    });
    aggregate.group({
      _id: { pacientId: '$_id.pacientId' },
      maxFlows: {
        $push: {
          maxInsFlow: '$maxInsFlow',
          maxExpFlow: '$maxExpFlow',
          maxScore: '$maxScore',
          maxScoreRatio: '$maxScoreRatio',

          created_at: '$_id.date',
          sessionNumber: '$_id.sessionNumber',
        },
      },
    });
    aggregate.project({
      pacientId: '$_id.pacientId',
      maxFlowsPerSession: '$maxFlows',
      plataformInfoPerSession: 1,
      _id: 0,
    });

    aggregate.sort({ 'maxFlows.created_at': 1 });

    const plataformStatistics = await aggregate.exec();
    const plataformStatisticsPacientsIds = plataformStatistics.map((x) => x.pacientId.toString());
    const plataformInfos = await this.plataformOverviewRepository.find(
      {
        pacientId: { $in: plataformStatisticsPacientsIds },
      },
      {
        pacientId: 1, maxScore: 1, scoreRatio: 1, phase: 1, level: 1,
      },
    );

    const plataformInfosObj = plataformInfos.map((t) => (
      {
        pacientId: t.pacientId,
        maxScore: t.maxScore,
        scoreRatio: t.scoreRatio,
        phase: t.phase,
        level: t.level,
      }
    ));
    plataformStatistics.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.plataformInfo = plataformInfosObj.filter((x) => x.pacientId === element.pacientId);
    });
  }

  async create(plataformOverview, gameToken) {
    const newPlataformOverview = plataformOverview || {};
    // eslint-disable-next-line no-underscore-dangle
    newPlataformOverview._gameToken = gameToken;

    const flowDataDevicesReq = plataformOverview.flowDataDevices;

    newPlataformOverview.devices = flowDataDevicesReq.map((x) => x.deviceName);

    // BUSCAR OS MAIORES VALORES
    newPlataformOverview.flowDataDevicesValues = flowDataDevicesReq.map((element) => ({
      deviceName: element.deviceName,
      maxFlowValue: element.flowData.reduce((max, el) => (
        el.flowValue > max ? el.flowValue : max), element.flowData[0].flowValue),
      minFlowValue: element.flowData.reduce((min, el) => (
        el.flowValue < min ? el.flowValue : min), element.flowData[0].flowValue),
      meanFlowValue: element.flowData.reduce((acc, value) => (
        acc + Number.parseFloat(value.flowValue)), 0) / element.flowData.length,
    }));

    delete newPlataformOverview.flowDataDevices;

    const pacientSession = await this.playSessionRepository.findOne(
      { pacientId: plataformOverview.pacientId }, { sort: { sessionNumber: -1 } },
    );

    if (!pacientSession) {
      const newPlaySession = { pacientId: plataformOverview.pacientId, sessionNumber: 1 };
      await this.playSessionRepository.create(newPlaySession);
    } else {
      const pacientSessionDate = new Date(pacientSession.created_at);
      pacientSessionDate.setHours(0, 0, 0, 0);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (pacientSessionDate.getTime() !== currentDate.getTime()) {
        const newPlaySession = {
          pacientId: plataformOverview.pacientId, sessionNumber: pacientSession.sessionNumber + 1,
        };
        await this.playSessionRepository.create(newPlaySession);
      }
    }

    const savedFlowDataDevices = await this.flowDataDeviceRepository.create({
      _gameToken: gameToken, flowDataDevices: flowDataDevicesReq,
    });
    // eslint-disable-next-line no-underscore-dangle
    newPlataformOverview.flowDataDevicesId = savedFlowDataDevices._id;
    const savedPlataformOverview = (
      await this.plataformOverviewRepository.create(newPlataformOverview)
    );

    return savedPlataformOverview;
  }

  async deleteManyByPacientId(pacientId) {
    return this.plataformOverviewRepository.deleteMany({ pacientId });
  }
};
