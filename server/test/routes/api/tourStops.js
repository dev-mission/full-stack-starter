const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/tours/:TourId/stops', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadUploads([
      ['512x512.png', 'cdd8007d-dcaf-4163-b497-92d378679668.png'],
      ['00-04.m4a', 'd2e150be-b277-4f68-96c7-22a477e0022f.m4a'],
    ]);
    await helper.loadFixtures(['users', 'invites', 'teams', 'memberships', 'resources', 'files', 'tours', 'stops', 'tourStops']);
    testSession = session(app);
    await testSession
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'regular.user@test.com', password: 'abcd1234' })
      .expect(StatusCodes.OK);
  });

  afterEach(async () => {
    await helper.cleanAssets();
  });

  describe('GET /', () => {
    it('returns TourStops for a Tour', async () => {
      const response = await testSession
        .get('/api/tours/495b18a8-ae05-4f44-a06d-c1809add0352/stops')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);

      assert.deepStrictEqual(response.body, [
        {
          id: 'c25b67d5-fef6-4b9b-8f54-7ded9d1889b4',
          TourId: '495b18a8-ae05-4f44-a06d-c1809add0352',
          StopId: 'e39b97ad-a5e9-422c-b256-d50fec355285',
          TransitionStopId: null,
          position: 1,
          Stop: {
            TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
            address: '965 Clay St, San Francisco, CA 94108',
            coordinate: null,
            destAddress: null,
            destCoordinate: null,
            destRadius: null,
            descriptions: {
              'en-us': 'CHSA is the oldest organization in the country dedicated to the preservation of Chinese American history.',
            },
            id: 'e39b97ad-a5e9-422c-b256-d50fec355285',
            link: 'chsa',
            names: {
              'en-us': 'CHSA',
            },
            radius: null,
            type: 'STOP',
            variants: [
              {
                code: 'en-us',
                displayName: 'English',
                name: 'English (US)',
              },
            ],
          },
        },
        {
          id: '473abc1e-c5cb-4148-a2e4-c75a1dfcb3e1',
          TourId: '495b18a8-ae05-4f44-a06d-c1809add0352',
          StopId: 'bba84716-633e-4593-85a0-9da4010eb99b',
          TransitionStopId: null,
          position: 2,
          Stop: {
            TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
            address: '708 Grant Ave, San Francisco, CA 94108',
            coordinate: null,
            destAddress: null,
            destCoordinate: null,
            destRadius: null,
            descriptions: {
              'en-us':
                "Kan's was the first restaurant in Chinatown to win the Holiday (magazine) Award for fine dining; that award was given to Kan's for 14 consecutive years. Its name was frequently on top ten lists of San Francisco restaurants. World-famous celebrities, movie stars, the rich and the powerful came to Kan's, and their appearances were written up by San Francisco columnist Herb Caen.",
            },
            id: 'bba84716-633e-4593-85a0-9da4010eb99b',
            link: 'kans-restaurant',
            names: {
              'en-us': "Kan's Restaurant",
            },
            radius: null,
            type: 'STOP',
            variants: [
              {
                code: 'en-us',
                displayName: 'English',
                name: 'English (US)',
              },
            ],
          },
        },
      ]);
    });
  });

  describe('POST /', () => {
    it('creates a new TourStop association', async () => {
      const response = await testSession
        .post('/api/tours/ae61f3e7-7de7-40e2-b9a1-c5ad9ff94806/stops')
        .set('Accept', 'application/json')
        .send({
          StopId: 'bba84716-633e-4593-85a0-9da4010eb99b',
          position: 1,
        })
        .expect(StatusCodes.CREATED);

      assert.deepStrictEqual(response.body, {
        id: response.body.id,
        TourId: 'ae61f3e7-7de7-40e2-b9a1-c5ad9ff94806',
        StopId: 'bba84716-633e-4593-85a0-9da4010eb99b',
        TransitionStopId: null,
        position: 1,
        Stop: {
          id: 'bba84716-633e-4593-85a0-9da4010eb99b',
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          link: 'kans-restaurant',
          address: '708 Grant Ave, San Francisco, CA 94108',
          coordinate: null,
          radius: null,
          destAddress: null,
          destCoordinate: null,
          destRadius: null,
          names: { 'en-us': "Kan's Restaurant" },
          descriptions: {
            'en-us':
              "Kan's was the first restaurant in Chinatown to win the Holiday (magazine) Award for fine dining; that award was given to Kan's for 14 consecutive years. Its name was frequently on top ten lists of San Francisco restaurants. World-famous celebrities, movie stars, the rich and the powerful came to Kan's, and their appearances were written up by San Francisco columnist Herb Caen.",
          },
          type: 'STOP',
          variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
        },
      });
    });

    it('sets position at end if not defined', async () => {
      const response = await testSession
        .post('/api/tours/495b18a8-ae05-4f44-a06d-c1809add0352/stops')
        .set('Accept', 'application/json')
        .send({
          StopId: 'cd682130-9b7e-4831-b211-bd74330f0e21',
        })
        .expect(StatusCodes.CREATED);

      assert.deepStrictEqual(response.body?.position, 3);
    });
  });

  describe('PATCH /:id', () => {
    it('updates a TourStop association', async () => {
      const response = await testSession
        .patch('/api/tours/495b18a8-ae05-4f44-a06d-c1809add0352/stops/c25b67d5-fef6-4b9b-8f54-7ded9d1889b4')
        .set('Accept', 'application/json')
        .send({
          position: 3,
        })
        .expect(StatusCodes.OK);

      assert.deepStrictEqual(response.body, {
        id: 'c25b67d5-fef6-4b9b-8f54-7ded9d1889b4',
        TourId: '495b18a8-ae05-4f44-a06d-c1809add0352',
        StopId: 'e39b97ad-a5e9-422c-b256-d50fec355285',
        TransitionStopId: null,
        position: 3,
      });
    });
  });

  describe('DELETE /:id', () => {
    it('removes a TourStop association', async () => {
      await testSession
        .delete('/api/tours/495b18a8-ae05-4f44-a06d-c1809add0352/stops/c25b67d5-fef6-4b9b-8f54-7ded9d1889b4')
        .set('Accept', 'application/json')
        .expect(StatusCodes.NO_CONTENT);

      assert.deepStrictEqual(await models.TourStop.findByPk('c25b67d5-fef6-4b9b-8f54-7ded9d1889b4'), null);
    });
  });
});
