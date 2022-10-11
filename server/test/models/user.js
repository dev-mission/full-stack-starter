const assert = require('assert');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuid } = require('uuid');

const helper = require('../helper');
const models = require('../../models');

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
        })
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
        })
      );
      return true;
    });
  });

  context('picture attachment', () => {
    let picture;

    beforeEach(() => {
      picture = `${uuid()}.png`;
      fs.ensureDirSync(path.resolve(__dirname, '../../tmp/uploads'));
      fs.copySync(path.resolve(__dirname, '../fixtures/files/512x512.png'), path.resolve(__dirname, `../../tmp/uploads/${picture}`));
    });

    afterEach(() => {
      fs.removeSync(path.resolve(__dirname, `../../tmp/uploads/${picture}`));
      fs.removeSync(path.resolve(__dirname, `../../public/assets`, process.env.ASSET_PATH_PREFIX));
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
      assert(
        fs.pathExistsSync(
          path.resolve(__dirname, '../../public/assets', process.env.ASSET_PATH_PREFIX, 'users', `${user.id}`, 'picture', picture)
        )
      );
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
