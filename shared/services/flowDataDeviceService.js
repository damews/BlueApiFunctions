const { Types } = require('mongoose');

module.exports = class AccountService {
  constructor(flowDataDeviceRepository, context) {
    this.flowDataDeviceRepository = flowDataDeviceRepository;
    this.context = context;
  }

  async getFlowDataDevice(flowDataDeviceId, gameToken) {
    const findObj = {
      _id: Types.ObjectId(flowDataDeviceId),
      _gameToken: gameToken,
    };

    const result = await this.flowDataDeviceRepository.find(findObj);

    return result;
  }
};
