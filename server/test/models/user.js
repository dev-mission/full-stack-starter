import assert from 'assert';
import _ from 'lodash';
import path from 'path';
import { v4 as uuid } from 'uuid';

import helper from '../helper.js';
import models from '../../models/index.js';

describe('models.User', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['users']);
  });

  it('creates a new User record', async () => {
    let user = models.User.build({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'abcd1234',
    });
    assert.deepStrictEqual(user.id, null);
    await user.save();
    assert(user.id);

    user = await models.User.findByPk(user.id);
    assert.deepStrictEqual(user.firstName, 'John');
    assert.deepStrictEqual(user.lastName, 'Doe');
    assert.deepStrictEqual(user.email, 'john.doe@test.com');
    assert.deepStrictEqual(user.isAdmin, false);
    assert(await user.authenticate('abcd1234'));
  });

  it('validates required fields', async () => {
    const user = models.User.build({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    await assert.rejects(user.save(), (error) => {
      assert(error instanceof models.Sequelize.ValidationError);
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
      return true;
    });
  });

  it('validates email uniqueness on create', async () => {
    const user = models.User.build({
      firstName: 'John',
      lastName: 'Doe',
      email: 'regular.user@test.com',
      password: 'abcd1234',
    });
    await assert.rejects(user.save(), (error) => {
      assert(error instanceof models.Sequelize.ValidationError);
      assert.deepStrictEqual(error.errors.length, 1);
      assert(
        _.find(error.errors, {
          path: 'email',
          message: 'Email already registered',
        }),
      );
      return true;
    });
  });

  it('validates email uniqueness on update', async () => {
    const user = await models.User.findByPk(2);
    assert(user);
    assert.deepStrictEqual(user.email, 'regular.user@test.com');
    user.email = 'admin.user@test.com';
    await assert.rejects(user.save(), (error) => {
      assert(error instanceof models.Sequelize.ValidationError);
      assert.deepStrictEqual(error.errors.length, 1);
      assert(
        _.find(error.errors, {
          path: 'email',
          message: 'Email already registered',
        }),
      );
      return true;
    });
  });

  context('picture attachment', () => {
    let picture;

    beforeEach(async () => {
      picture = `${uuid()}.png`;
      await helper.loadUploads([['512x512.png', picture]]);
    });

    afterEach(async () => {
      await helper.cleanAssets();
    });

    it('handles a picture asset upload', async () => {
      const user = models.User.build({
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@test.com',
        password: 'abcd1234',
        picture,
      });
      await user.save();
      await helper.sleep(100);
      assert(await helper.assetPathExists(path.join('users', `${user.id}`, 'picture', picture)));
    });

    describe('.pictureUrl', () => {
      it('returns an asset url for the picture', () => {
        const user = models.User.build({
          picture,
        });
        assert.deepStrictEqual(user.pictureUrl, `/api/assets/users/${user.id}/picture/${picture}`);
      });
    });
  });
});
