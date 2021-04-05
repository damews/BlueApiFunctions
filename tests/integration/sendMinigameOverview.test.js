const request = require('supertest');

const apiUrl = 'https://iblueit-magrathea-apim.azure-api.net/api';
const apiUrlSufix = '/minigames';
const gameToken = 'b6acccf4-178b-4071-af27-f7a31dd1e2f9';
const pacientId = '605fae96f2c91b064840f750';

describe('On MinigameOverview request endpoints', () => {
  it('Should return 201 when sending a valid MinigameOverview', async () => {
    await request(apiUrl)
      .post(`/${apiUrlSufix}`)
      .send(
        {
          pacientId,
          minigameName: 'CakeGame',
          respiratoryExercise: 'ExpiratoryPeak',
          flowDataRounds: [
            {
              minigameRound: 1,
              roundScore: 10,
              roundFlowScore: 10,
              flowDataDevices: [
                {
                  deviceName: 'Pitaco',
                  flowData: [
                    {
                      flowValue: 10,
                      timestamp: '2021-01-01T00:00:03',
                    },
                  ],
                },
              ],
            },
            {
              minigameRound: 2,
              roundScore: 20,
              roundFlowScore: 20,
              flowDataDevices: [
                {
                  deviceName: 'Pitaco',
                  flowData: [
                    {
                      flowValue: 20,
                      timestamp: '2021-01-01T00:00:03',
                    },
                  ],
                },
              ],
            },
            {
              minigameRound: 3,
              roundScore: 30,
              roundFlowScore: 30,
              flowDataDevices: [
                {
                  deviceName: 'Cinta',
                  flowData: [
                    {
                      flowValue: 30,
                      timestamp: '2021-01-01T00:00:03',
                    },
                  ],
                },
              ],
            },
          ],
        },
      )
      .set('game-token', gameToken)
      .expect(201);
  }, 10000);
});
