const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/users', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'invites', 'teams', 'memberships']);
    testSession = session(app);
  });

  context('unauthenticated', () => {
    describe('GET /me', () => {
      it('returns no content for unauthenticated requests', async () => {
        await testSession.get('/api/users/me').expect(StatusCodes.NO_CONTENT);
      });
    });
  });

  context('authenticated', () => {
    describe('GET /me', () => {
      it('returns signed in User for authenticated requests', async () => {
        await testSession
          .post('/api/auth/login')
          .set('Accept', 'application/json')
          .send({ email: 'regular.user@test.com', password: 'abcd1234' })
          .expect(StatusCodes.OK);
        const response = await testSession.get('/api/users/me').expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body, {
          email: 'regular.user@test.com',
          firstName: 'Regular',
          id: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
          isAdmin: false,
          lastName: 'User',
          picture: null,
          pictureURL: null,
          Memberships: [
            {
              id: '5a313737-e5ff-48fd-ba6b-b82983a7a7bf',
              Team: {
                id: '1a93d46d-89bf-463b-ab23-8f22f5777907',
                link: 'regularuser',
                name: "Regular's Personal Team",
                variants: [
                  {
                    code: 'en-us',
                    displayName: 'English',
                    name: 'English (US)',
                  },
                ],
              },
              TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
              UserId: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
              InviteId: null,
              role: 'OWNER',
            },
          ],
        });
      });
    });
  });

  context('admin authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(StatusCodes.OK);
    });

    describe('GET /', () => {
      it('returns a list of Users ordered by last name, first name, email', async () => {
        /// request user list
        const response = await testSession.get('/api/users').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.length, 3);

        const users = response.body;
        assert.deepStrictEqual(users[0].firstName, 'Admin');
        assert.deepStrictEqual(users[1].firstName, 'Another');
        assert.deepStrictEqual(users[2].firstName, 'Regular');
      });
    });

    describe('GET /:id', () => {
      it('returns a User by its id', async () => {
        /// request user list
        const response = await testSession
          .get('/api/users/b9d53b71-faac-4ead-bbb6-745412b79bbf')
          .set('Accept', 'application/json')
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body, {
          id: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
          firstName: 'Regular',
          lastName: 'User',
          email: 'regular.user@test.com',
          isAdmin: false,
          picture: null,
          pictureURL: null,
        });
      });
    });

    describe('PATCH /:id', () => {
      it('updates a User by its id', async () => {
        const response = await testSession
          .patch('/api/users/b9d53b71-faac-4ead-bbb6-745412b79bbf')
          .set('Accept', 'application/json')
          .send({
            firstName: 'Normal',
            lastName: 'Person',
            email: 'normal.person@test.com',
          })
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body, {
          id: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
          firstName: 'Normal',
          lastName: 'Person',
          email: 'normal.person@test.com',
          isAdmin: false,
          picture: null,
          pictureURL: null,
          Memberships: [
            {
              id: '5a313737-e5ff-48fd-ba6b-b82983a7a7bf',
              Team: {
                id: '1a93d46d-89bf-463b-ab23-8f22f5777907',
                link: 'regularuser',
                name: "Regular's Personal Team",
                variants: [
                  {
                    code: 'en-us',
                    displayName: 'English',
                    name: 'English (US)',
                  },
                ],
              },
              TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
              UserId: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
              InviteId: null,
              role: 'OWNER',
            },
          ],
        });
      });

      it('validates required fields', async () => {
        const response = await testSession
          .patch('/api/users/b9d53b71-faac-4ead-bbb6-745412b79bbf')
          .set('Accept', 'application/json')
          .send({
            firstName: '',
            lastName: '',
            email: '',
            password: 'foo',
          })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        const error = response.body;
        assert.deepStrictEqual(error.status, StatusCodes.UNPROCESSABLE_ENTITY);
        assert.deepStrictEqual(error.errors.length, 4);
        assert(
          _.find(error.errors, {
            path: 'firstName',
            message: 'First name cannot be blank',
          })
        );
        assert(
          _.find(error.errors, {
            path: 'lastName',
            message: 'Last name cannot be blank',
          })
        );
        assert(
          _.find(error.errors, {
            path: 'email',
            message: 'Email cannot be blank',
          })
        );
        assert(
          _.find(error.errors, {
            path: 'password',
            message: 'Minimum eight characters, at least one letter and one number',
          })
        );
      });

      it('validates email is not already registered', async () => {
        const response = await testSession
          .patch('/api/users/b9d53b71-faac-4ead-bbb6-745412b79bbf')
          .set('Accept', 'application/json')
          .send({
            email: 'admin.user@test.com',
          })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        const error = response.body;
        assert.deepStrictEqual(error.status, StatusCodes.UNPROCESSABLE_ENTITY);
        assert.deepStrictEqual(error.errors.length, 1);
        assert(
          _.find(error.errors, {
            path: 'email',
            message: 'Email already registered',
          })
        );
      });
    });
  });
});
