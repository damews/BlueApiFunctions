const { Types } = require('mongoose');

module.exports = class PacientService {
  constructor({ pacientRepository, context } = {}) {
    this.pacientRepository = pacientRepository;
    this.context = context;
  }

  async getPacient(pacientId, gameToken) {
    const aggregate = this.pacientRepository.getAggregate();
    aggregate.match({ _id: Types.ObjectId(pacientId), _gameToken: gameToken });

    aggregate.lookup({
      from: 'playsessions',
      let: { pacientId: '$_id' },
      pipeline:
        [
          { $addFields: { pacientId: { $toObjectId: '$pacientId' } } },
          { $match: { $expr: { $eq: ['$pacientId', '$$pacientId'] } } },
        ],
      as: 'playSessions',
    });

    const result = await aggregate.exec();

    return result[0];
  }

  async getPacients(filter, gameToken) {
    const aggregate = this.pacientRepository.getAggregate();

    const matchOperators = { $match: { _gameToken: gameToken } };

    if (filter.name) { matchOperators.$match.name = { $regex: `^${filter.name}.*`, $options: 'i' }; }
    if (filter.condition) { matchOperators.$match.condition = { $eq: filter.condition }; }
    if (filter.sex) { matchOperators.$match.sex = { $eq: filter.sex }; }

    if (filter.fromAge) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setFullYear(date.getFullYear() - filter.fromAge);
      matchOperators.$match.birthday = {
        $lte: new Date(date.toISOString()),
      };
    }
    if (filter.toAge) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setFullYear(date.getFullYear() - filter.toAge);
      matchOperators.$match.birthday = {
        $gte: new Date(date.toISOString()),
      };
    }
    if (filter.fromAge && filter.toAge) {
      const fromAgeDate = new Date();
      fromAgeDate.setHours(0, 0, 0, 0);
      fromAgeDate.setFullYear(fromAgeDate.getFullYear() - filter.toAge);

      const toAgeDate = new Date();
      toAgeDate.setHours(0, 0, 0, 0);
      toAgeDate.setFullYear(toAgeDate.getFullYear() - filter.fromAge);

      matchOperators.$match.birthday = {
        $lte: new Date(toAgeDate.toISOString()),
        $gte: new Date(fromAgeDate.toISOString()),
      };
    }

    aggregate.append(matchOperators);

    if (filter.sort === 'asc') { aggregate.sort({ name: 1 }); } else { aggregate.sort({ name: -1 }); }

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
              ],
            },
          },
        },
      ],
      as: 'playSessions',
    });

    if (filter.limit) { aggregate.limit(parseInt(filter.limit, 10)); }
    if (filter.skip) { aggregate.skip(parseInt(filter.skip, 10)); }

    const result = await aggregate.exec();

    return result;
  }

  async create(pacient, gameToken) {
    const newPacient = pacient || {};

    // eslint-disable-next-line no-underscore-dangle
    newPacient._gameToken = gameToken;
    newPacient.birthday = new Date(`${pacient.birthday} 00:00:00:000`);

    return this.pacientRepository.create(newPacient);
  }

  async delete(pacientId) {
    return this.pacientRepository.deleteMany({ _id: Types.ObjectId(pacientId) });
  }

  async deleteManyByGameToken(gameToken) {
    return this.pacientRepository.deleteMany({ _gameToken: gameToken });
  }
};
