const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/stops', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadUploads([
      ['512x512.png', 'cdd8007d-dcaf-4163-b497-92d378679668.png'],
      ['00-04.m4a', 'd2e150be-b277-4f68-96c7-22a477e0022f.m4a'],
    ]);
    await helper.loadFixtures(['users', 'teams', 'memberships', 'resources', 'files', 'tours', 'stops']);
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
    it('returns a list of Stops for a specified Team', async () => {
      const response = await testSession
        .get('/api/stops?TeamId=1a93d46d-89bf-463b-ab23-8f22f5777907')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body.length, 3);
      assert.deepStrictEqual(response.body[0].link, 'ccba');
      assert.deepStrictEqual(response.body[1].link, 'chsa');
      assert.deepStrictEqual(response.body[2].link, 'kans-restaurant');
    });
  });

  describe('POST /', () => {
    it('creates a new Stop', async () => {
      const data = {
        type: 'STOP',
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        link: 'telephone-exchange',
        address: '743 Washington St, San Francisco, CA 94108',
        names: { 'en-us': 'Chinese Telephone Exchange' },
        descriptions: {
          'en-us': 'The Bank of Canton at 743 Washington Street was once the original Telephone Exchange in Chinatown in 1887.',
        },
        variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
      };
      const response = await testSession.post('/api/stops').set('Accept', 'application/json').send(data).expect(StatusCodes.CREATED);

      assert(response.body?.id);
      assert.deepStrictEqual(response.body, {
        ...data,
        id: response.body.id,
        coordinate: null,
        radius: null,
        destAddress: null,
        destCoordinate: null,
        destRadius: null,
      });

      const record = await models.Stop.findByPk(response.body.id);
      assert(record);
      assert.deepStrictEqual(record.name, 'Chinese Telephone Exchange');
      assert.deepStrictEqual(record.link, 'telephone-exchange');
      assert.deepStrictEqual(record.address, '743 Washington St, San Francisco, CA 94108');
    });

    it('validates the presence of the Tour name', async () => {
      const response = await testSession
        .post('/api/stops')
        .set('Accept', 'application/json')
        .send({
          type: 'STOP',
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          link: 'telephone-exchange',
          address: '743 Washington St, San Francisco, CA 94108',
          names: {},
          descriptions: {
            'en-us': 'The Bank of Canton at 743 Washington Street was once the original Telephone Exchange in Chinatown in 1887.',
          },
          variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
          visibility: 'PRIVATE',
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      assert.deepStrictEqual(response.body, {
        errors: [
          {
            message: 'Name cannot be blank',
            path: 'name',
            value: '',
          },
        ],
        status: 422,
      });
    });

    it('validates the uniqueness of the Tour link', async () => {
      const response = await testSession
        .post('/api/stops')
        .set('Accept', 'application/json')
        .send({
          type: 'STOP',
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          link: 'chsa',
          address: '743 Washington St, San Francisco, CA 94108',
          names: { 'en-us': 'Chinese Telephone Exchange' },
          descriptions: {
            'en-us': 'The Bank of Canton at 743 Washington Street was once the original Telephone Exchange in Chinatown in 1887.',
          },
          variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
          visibility: 'PRIVATE',
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      assert.deepStrictEqual(response.body, {
        errors: [
          {
            message: 'Link already taken',
            path: 'link',
            value: 'chsa',
          },
        ],
        status: 422,
      });
    });

    it('validates the format of the Team link', async () => {
      const response = await testSession
        .post('/api/tours')
        .set('Accept', 'application/json')
        .send({
          type: 'STOP',
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          link: 'invalid link',
          address: '743 Washington St, San Francisco, CA 94108',
          names: { 'en-us': 'Chinese Telephone Exchange' },
          descriptions: {
            'en-us': 'The Bank of Canton at 743 Washington Street was once the original Telephone Exchange in Chinatown in 1887.',
          },
          variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
          visibility: 'PRIVATE',
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      assert.deepStrictEqual(response.body, {
        errors: [
          {
            message: 'Letters, numbers, and hyphen only',
            path: 'link',
            value: 'invalid link',
          },
        ],
        status: 422,
      });
    });
  });

  describe('GET /:id', () => {
    it('returns a Stop by id', async () => {
      const response = await testSession
        .get('/api/stops/e39b97ad-a5e9-422c-b256-d50fec355285')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);

      const data = { ...response.body };
      assert.deepStrictEqual(data, {
        id: 'e39b97ad-a5e9-422c-b256-d50fec355285',
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        type: 'STOP',
        link: 'chsa',
        address: '965 Clay St, San Francisco, CA 94108',
        coordinate: null,
        radius: null,
        destAddress: null,
        destCoordinate: null,
        destRadius: null,
        names: { 'en-us': 'CHSA' },
        descriptions: {
          'en-us': 'CHSA is the oldest organization in the country dedicated to the preservation of Chinese American history.',
        },
        variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
      });
    });
  });
});
