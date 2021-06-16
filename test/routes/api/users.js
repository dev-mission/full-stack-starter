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

  context('admin authenticated', () => {
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
        assert.deepStrictEqual(users[0].firstName, 'Admin');
        assert.deepStrictEqual(users[1].firstName, 'Regular');
      });
    });

    describe('GET /:id', () => {
      it('returns a User by its id', async () => {
        /// request user list
        const response = await testSession
          .get('/api/users/2')
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        assert.deepStrictEqual(response.body, {
          id: 2,
          firstName: 'Regular',
          lastName: 'User',
          email: 'regular.user@test.com'
        });
      });
    });

    describe('PATCH /:id', () => {
      it('updates a User by its id', async () => {
        const response = await testSession
          .patch('/api/users/2')
          .set('Accept', 'application/json')
          .send({
            firstName: 'Normal',
            lastName: 'Person',
            email: 'normal.person@test.com'
          })
          .expect(HttpStatus.OK);

          assert.deepStrictEqual(response.body, {
            id: 2,
            firstName: 'Normal',
            lastName: 'Person',
            email: 'normal.person@test.com'
          });
        })
    });
  });
});
