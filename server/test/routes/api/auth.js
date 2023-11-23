import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import session from 'supertest-session';

import helper from '../../helper.js';
import app from '../../../app.js';

describe('/api/auth', () => {
  let testSession;

  before(() => {
    process.env.VITE_FEATURE_REGISTRATION = 'true';
  });

  beforeEach(async () => {
    await helper.loadFixtures(['users']);
    testSession = session(app);
  });

  describe('POST /register', () => {
    it('registers a new User', async () => {
      const response = await testSession
        .post('/api/auth/register')
        .set('Accept', 'application/json')
        .send({
          firstName: 'Normal',
          lastName: 'Person',
          email: 'normal.person@test.com',
          password: 'abcd1234',
        })
        .expect(StatusCodes.CREATED);

      const { id } = response.body;
      assert(id);
      assert.deepStrictEqual(response.body, {
        id,
        firstName: 'Normal',
        lastName: 'Person',
        email: 'normal.person@test.com',
        isAdmin: false,
        picture: null,
        pictureUrl: null,
      });
    });

    it('validates required fields', async () => {
      const response = await testSession
        .post('/api/auth/register')
        .set('Accept', 'application/json')
        .send({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      const error = response.body;
      assert.deepStrictEqual(error.status, StatusCodes.UNPROCESSABLE_ENTITY);
      assert.deepStrictEqual(error.errors.length, 4);
      assert(
        _.find(error.errors, {
          path: 'firstName',
          message: 'First name cannot be blank',
        }),
      );
      assert(
        _.find(error.errors, {
          path: 'lastName',
          message: 'Last name cannot be blank',
        }),
      );
      assert(
        _.find(error.errors, {
          path: 'email',
          message: 'Email cannot be blank',
        }),
      );
      assert(
        _.find(error.errors, {
          path: 'password',
          message: 'Minimum eight characters, at least one letter and one number',
        }),
      );
    });

    it('validates email is not already registered', async () => {
      const response = await testSession
        .post('/api/auth/register')
        .set('Accept', 'application/json')
        .send({
          firstName: 'Normal',
          lastName: 'Person',
          email: 'regular.user@test.com',
          password: 'abcd1234',
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      const error = response.body;
      assert.deepStrictEqual(error.status, StatusCodes.UNPROCESSABLE_ENTITY);
      assert.deepStrictEqual(error.errors.length, 1);
      assert(
        _.find(error.errors, {
          path: 'email',
          message: 'Email already registered',
        }),
      );
    });
  });
});
