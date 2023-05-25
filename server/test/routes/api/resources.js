const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/resources', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadUploads([
      ['512x512.png', 'cdd8007d-dcaf-4163-b497-92d378679668.png'],
      ['00-04.m4a', 'd2e150be-b277-4f68-96c7-22a477e0022f.m4a'],
    ]);
    await helper.loadFixtures(['users', 'teams', 'memberships', 'resources', 'files']);
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
    it('returns a list of Resources for a specified Team', async () => {
      const response = await testSession
        .get('/api/resources?TeamId=1a93d46d-89bf-463b-ab23-8f22f5777907')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body.length, 2);
      assert.deepStrictEqual(response.body[0].name, 'Resource 1');
      assert.deepStrictEqual(response.body[1].name, 'Resource 2');
    });

    it('returns a list of Resources of a specified type for a specified Team', async () => {
      const response = await testSession
        .get('/api/resources?TeamId=1a93d46d-89bf-463b-ab23-8f22f5777907&type=AUDIO')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body.length, 1);
      assert.deepStrictEqual(response.body[0].name, 'Resource 2');
    });

    it('returns a list of Resources of a specified type for a specified Team filtered by search query', async () => {
      let response = await testSession
        .get('/api/resources?TeamId=1a93d46d-89bf-463b-ab23-8f22f5777907&type=AUDIO&search=none')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body.length, 0);

      response = await testSession
        .get('/api/resources?TeamId=1a93d46d-89bf-463b-ab23-8f22f5777907&type=AUDIO&search=2')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body.length, 1);
      assert.deepStrictEqual(response.body[0].name, 'Resource 2');
    });
  });

  describe('POST /', () => {
    it('creates a new Resource', async () => {
      const data = {
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        name: 'New Resource',
        type: 'LINK',
        variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
      };
      const response = await testSession
        .post('/api/resources')
        .set('Accept', 'application/json')
        .send({
          ...data,
          Files: [
            {
              variant: 'en-us',
              externalURL: 'https://test.com',
            },
          ],
        })
        .expect(StatusCodes.CREATED);

      assert(response.body?.id);
      assert.deepStrictEqual(response.body, { ...data, id: response.body.id });

      const record = await models.Resource.findByPk(response.body.id);
      assert(record);
      assert.deepStrictEqual(record.name, 'New Resource');
      assert.deepStrictEqual(record.type, 'LINK');

      const files = await record.getFiles();
      assert.deepStrictEqual(files.length, 1);
      assert.deepStrictEqual(files[0].variant, 'en-us');
      assert.deepStrictEqual(files[0].externalURL, 'https://test.com');
      assert.deepStrictEqual(files[0].URL, 'https://test.com');
    });

    it('validates the presence of the Resource name', async () => {
      const response = await testSession
        .post('/api/resources')
        .set('Accept', 'application/json')
        .send({
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          name: '',
          type: 'LINK',
          variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
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

    it('validates the presence of the Resource type', async () => {
      const response = await testSession
        .post('/api/resources')
        .set('Accept', 'application/json')
        .send({
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          name: 'New Resource',
          type: '',
          variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      assert.deepStrictEqual(response.body, {
        errors: [
          {
            message: 'Type cannot be blank',
            path: 'type',
            value: '',
          },
        ],
        status: 422,
      });
    });
  });

  describe('GET /:id', () => {
    it('returns a Resource by id', async () => {
      const response = await testSession
        .get('/api/resources/6ebacda9-8d33-4c3e-beb5-18dffb119046')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);

      const data = { ...response.body };
      assert.deepStrictEqual(data, {
        id: '6ebacda9-8d33-4c3e-beb5-18dffb119046',
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        name: 'Resource 2',
        type: 'AUDIO',
        variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
        Files: [
          {
            ResourceId: '6ebacda9-8d33-4c3e-beb5-18dffb119046',
            URL: '/api/assets/files/84b62056-05a4-4751-953f-7854ac46bc0f/key/d2e150be-b277-4f68-96c7-22a477e0022f.m4a',
            externalURL: null,
            id: '84b62056-05a4-4751-953f-7854ac46bc0f',
            key: 'd2e150be-b277-4f68-96c7-22a477e0022f.m4a',
            keyURL: '/api/assets/files/84b62056-05a4-4751-953f-7854ac46bc0f/key/d2e150be-b277-4f68-96c7-22a477e0022f.m4a',
            variant: 'en-us',
          },
        ],
      });
    });
  });
});
