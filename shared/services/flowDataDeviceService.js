const { Types } = require('mongoose');

module.exports = class FlowDataDeviceService {
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

  async deleteManyByPacientId(pacientId) {
    return this.flowDataDeviceRepository.deleteMany({ pacientId });
  }

  async deleteManyByGameToken(gameToken) {
    return this.flowDataDeviceRepository.deleteMany({ _gameToken: gameToken });
  }
};
