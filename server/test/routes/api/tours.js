const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/tours', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'teams', 'memberships', 'tours']);
    testSession = session(app);
    await testSession
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'regular.user@test.com', password: 'abcd1234' })
      .expect(StatusCodes.OK);
  });

  describe('GET /', () => {
    it('returns a list of Tours for a specified Team', async () => {
      const response = await testSession
        .get('/api/tours?TeamId=1a93d46d-89bf-463b-ab23-8f22f5777907')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);
      assert(response.body.length, 2);
      assert.deepStrictEqual(response.body[0].link, 'tour1');
      assert.deepStrictEqual(response.body[1].link, 'tour2');
    });
  });

  describe('POST /', () => {
    it('creates a new Tour', async () => {
      const data = {
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        link: 'newtour',
        names: { 'en-us': 'New Tour' },
        descriptions: { 'en-us': 'New Tour description' },
        variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
        visibility: 'PRIVATE',
      };
      const response = await testSession.post('/api/tours').set('Accept', 'application/json').send(data).expect(StatusCodes.CREATED);

      assert(response.body?.id);
      assert.deepStrictEqual(response.body, { ...data, id: response.body.id });

      const record = await models.Tour.findByPk(response.body.id);
      assert(record);
      assert.deepStrictEqual(record.name, 'New Tour');
      assert.deepStrictEqual(record.link, 'newtour');
    });

    it('validates the presence of the Tour name', async () => {
      const response = await testSession
        .post('/api/tours')
        .set('Accept', 'application/json')
        .send({
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          link: 'newtour',
          names: {},
          descriptions: { 'en-us': 'New Tour description' },
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
        .post('/api/tours')
        .set('Accept', 'application/json')
        .send({
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          link: 'tour2',
          names: { 'en-us': 'New Tour' },
          descriptions: { 'en-us': 'New Tour description' },
          variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
          visibility: 'PRIVATE',
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      assert.deepStrictEqual(response.body, {
        errors: [
          {
            message: 'Link already taken',
            path: 'link',
            value: 'tour2',
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
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          link: 'invalid link',
          names: { 'en-us': 'New Tour' },
          descriptions: { 'en-us': 'New Tour description' },
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
    it('returns a Tour by id', async () => {
      const response = await testSession
        .get('/api/tours/495b18a8-ae05-4f44-a06d-c1809add0352')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);

      const data = { ...response.body };
      assert.deepStrictEqual(data, {
        id: '495b18a8-ae05-4f44-a06d-c1809add0352',
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        link: 'tour2',
        names: { 'en-us': 'Tour 2' },
        descriptions: { 'en-us': 'Tour 2 description' },
        variants: [{ name: 'English (US)', displayName: 'English', code: 'en-us' }],
        visibility: 'PRIVATE',
      });
    });
  });
});
