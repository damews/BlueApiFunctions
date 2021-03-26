module.exports = class PlaySessionService {
  constructor({ playSessionRepository, context } = {}) {
    this.playSessionRepository = playSessionRepository;
    this.context = context;
  }

  async getSessionByPacientId(pacientId) {
    const result = await this.playSessionRepository.find(
      { pacientId }, { sort: { sessionNumber: -1 } },
    );
    return result;
  }

  async deleteManyByPacientId(pacientId) {
    return this.plataformOverviewRepository.deleteMany({ pacientId });
  }
};
