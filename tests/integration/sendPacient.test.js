const request = require('supertest');

const apiUrl = 'https://iblueit-magrathea-apim.azure-api.net/api';
const apiUrlSufix = '/pacients';
const gameToken = 'b6acccf4-178b-4071-af27-f7a31dd1e2f9';

describe('On Pacient request endpoints', () => {
  it('Should return 201 when sending a valid Pacient', async () => {
    await request(apiUrl)
      .post(`/${apiUrlSufix}`)
      .send(
        {
          name: 'Mike Doe Test',
          sex: 'Male',
          birthday: '2020-01-01',
          capacitiesPitaco: {
            insPeakFlow: 1,
            expPeakFlow: 1,
            insFlowDuration: 1,
            expFlowDuration: 1,
            respiratoryRate: 1
          },
          capacitiesMano: {
            insPeakFlow: 1,
            expPeakFlow: 1,
            insFlowDuration: 1,
            expFlowDuration: 1,
            respiratoryRate: 1
          },
          capacitiesCinta: {
            insPeakFlow: 1,
            expPeakFlow: 1,
            insFlowDuration: 1,
            expFlowDuration: 1,
            respiratoryRate: 1
          },
          observations: 'Teste',
          condition: 'Healthy',
          unlockedLevels: 1,
          accumulatedScore: 1,
          playSessionsDone: 1,
          calibrationPitacoDone: false,
          calibrationManoDone: false,
          calibrationCintaDone: false,
          howToPlayDone: false,
          weight: 100,
          height: 100,
          pitacoThreshold: 1,
          manoThreshold: 1,
          cintaThreshold: 1,
          ethnicity: 'White',
        },
      )
      .set('game-token', gameToken)
      .expect(201);
  }, 10000);
});
