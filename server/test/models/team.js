const assert = require('assert');

const helper = require('../helper');
const models = require('../../models');

describe('models.Team', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['users', 'invites', 'teams', 'memberships']);
  });

  describe('.getMembership()', () => {
    it('returns null if User is not a member', async () => {
      const team = await models.Team.findByPk('1a93d46d-89bf-463b-ab23-8f22f5777907');
      const user = await models.User.findByPk('552be152-a88b-43c0-b009-1a087caad67a');
      const membership = await team.getMembership(user);
      assert.deepStrictEqual(membership, null);
    });

    it('returns Membership if User is a member', async () => {
      const team = await models.Team.findByPk('1a93d46d-89bf-463b-ab23-8f22f5777907');
      const user = await models.User.findByPk('b9d53b71-faac-4ead-bbb6-745412b79bbf');
      const membership = await team.getMembership(user);
      assert(membership instanceof models.Membership);
    });
  });
});
