const request = require('supertest');

const apiUrl = 'https://iblueit-magrathea-apim.azure-api.net/api';
const apiUrlSufix = '/calibrations';
const gameToken = 'b6acccf4-178b-4071-af27-f7a31dd1e2f9';
const pacientId = '605fae96f2c91b064840f750';

describe('On CalibrationmOverview request endpoints', () => {
  it('Should return 201 when sending a valid CalibrationOverview', async () => {
    await request(apiUrl)
      .post(`/${apiUrlSufix}`)
      .send(
        {
          pacientId,
          gameDevice: 'Pitaco',
          minigameName: 'CakeGame',
          calibrationExercise: 'ExpiratoryPeak',
          calibrationValue: 10,
        },
      )
      .set('game-token', gameToken)
      .expect(201);
  }, 10000);
});
