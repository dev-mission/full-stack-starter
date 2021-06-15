const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/users', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['sections', 'users']);
    testSession = session(app);
  });

  context('authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);
    });

    describe('GET /', () => {
      it('returns a list of Users ordered by last name, first name, email', async () => {
        /// request user list
        const response = await testSession
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);
        assert(response.body?.length, 2);
  
        const users = response.body;
        assert.strictEqual(users[0].firstName, 'Admin');
        assert.strictEqual(users[1].firstName, 'Regular');
      });
    });
  });
});
