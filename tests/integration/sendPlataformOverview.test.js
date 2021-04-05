const request = require('supertest');

const apiUrl = 'https://iblueit-magrathea-apim.azure-api.net/api';
const apiUrlSufix = '/plataforms';
const gameToken = 'b6acccf4-178b-4071-af27-f7a31dd1e2f9';
const pacientId = '605fae96f2c91b064840f750';

describe('On PlataformOverview request endpoints', () => {
  it('Should return 201 when sending a valid PlataformOverview', async () => {
    await request(apiUrl)
      .post(`/${apiUrlSufix}`)
      .send(
        {
          pacientId,
          flowDataDevices: [
            {
              deviceName: 'Pitaco',
              flowData: [
                {
                  flowValue: 400,
                  timestamp: '2021-01-01T00:00:03',
                },
              ],
            },
          ],
          playStart: '2021-01-01T00:00:03',
          playFinish: '2021-01-01T00:00:03',
          duration: 99,
          result: 1,
          stageId: 1,
          phase: 1,
          level: 1,
          relaxTimeSpawned: 1,
          maxScore: 1,
          scoreRatio: 1,
          targetsSpawned: 1,
          targetsSuccess: 1,
          targetsInsuccess: 1,
          targetsExpSuccess: 1,
          targetsFails: 1,
          targetsInsFail: 1,
          targetsExpFail: 1,
          obstaclesSpawned: 1,
          obstaclesSuccess: 1,
          obstaclesInsSuccess: 1,
          obstaclesExpSuccess: 1,
          obstaclesFail: 1,
          obstaclesInsFail: 1,
          obstaclesExpFail: 1,
          playerHp: 1,
        },
      )
      .set('game-token', gameToken)
      .expect(201);
  }, 10000);
});
