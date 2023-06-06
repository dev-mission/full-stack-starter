const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const nodemailerMock = require('nodemailer-mock');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/memberships', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'invites', 'teams', 'memberships']);
    testSession = session(app);
    await testSession
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'regular.user@test.com', password: 'abcd1234' })
      .expect(StatusCodes.OK);
  });

  describe('POST /', () => {
    it('adds an existing User to a Team', async () => {
      const response = await testSession
        .post('/api/memberships')
        .set('Accept', 'application/json')
        .send({
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          email: 'Admin.user@test.com',
          role: 'EDITOR',
        })
        .expect(StatusCodes.CREATED);

      assert.deepStrictEqual(response.body, {
        id: response.body?.id,
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        InviteId: null,
        UserId: '552be152-a88b-43c0-b009-1a087caad67a',
        role: 'EDITOR',
        User: {
          email: 'admin.user@test.com',
          firstName: 'Admin',
          id: '552be152-a88b-43c0-b009-1a087caad67a',
          isAdmin: true,
          lastName: 'User',
          picture: null,
          pictureURL: null,
        },
      });

      const record = await models.Membership.findByPk(response.body.id);
      assert(record);
      assert.deepStrictEqual(record.TeamId, '1a93d46d-89bf-463b-ab23-8f22f5777907');
      assert.deepStrictEqual(record.UserId, '552be152-a88b-43c0-b009-1a087caad67a');
      assert.deepStrictEqual(record.role, 'EDITOR');
    });

    it('invites a new User to a Team', async () => {
      const response = await testSession
        .post('/api/memberships')
        .set('Accept', 'application/json')
        .send({
          TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
          email: 'new.user@test.com',
          role: 'EDITOR',
        })
        .expect(StatusCodes.CREATED);

      assert.deepStrictEqual(response.body, {
        id: response.body?.id,
        TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        UserId: null,
        InviteId: response.body?.InviteId,
        role: 'EDITOR',
        Invite: {
          AcceptedByUserId: null,
          CreatedByUserId: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
          RevokedByUserId: null,
          acceptedAt: null,
          createdAt: response.body?.Invite?.createdAt,
          email: 'new.user@test.com',
          firstName: null,
          id: response.body?.InviteId,
          lastName: null,
          message: null,
          revokedAt: null,
          updatedAt: response.body?.Invite?.updatedAt,
        },
      });

      const record = await models.Membership.findByPk(response.body.id);
      assert(record);
      assert.deepStrictEqual(record.TeamId, '1a93d46d-89bf-463b-ab23-8f22f5777907');
      assert.deepStrictEqual(record.InviteId, response.body.InviteId);
      assert.deepStrictEqual(record.role, 'EDITOR');

      const invite = await record.getInvite();
      assert(invite);
      assert.deepStrictEqual(invite.email, 'new.user@test.com');

      const emails = nodemailerMock.mock.getSentMail();
      assert.deepStrictEqual(emails.length, 1);
      assert.deepStrictEqual(
        emails[0].subject,
        `You are invited to join Regular&#39;s Personal Team on ${process.env.REACT_APP_SITE_TITLE}!`
      );
      assert.deepStrictEqual(emails[0].to, 'new.user@test.com');
    });
  });

  describe('PATCH /:id', () => {
    it('updates a Membership', async () => {
      await testSession
        .patch('/api/memberships/886304d3-cb45-442f-8914-f7fad8b6781a')
        .send({
          role: 'EDITOR',
        })
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);

      const record = await models.Membership.findByPk('886304d3-cb45-442f-8914-f7fad8b6781a');
      assert.deepStrictEqual(record.role, 'EDITOR');
    });
  });

  describe('DELETE /:id', () => {
    it('deletes a Membership', async () => {
      await testSession
        .delete('/api/memberships/886304d3-cb45-442f-8914-f7fad8b6781a')
        .set('Accept', 'application/json')
        .expect(StatusCodes.NO_CONTENT);

      const record = await models.Membership.findByPk('886304d3-cb45-442f-8914-f7fad8b6781a');
      assert.deepStrictEqual(record, null);
    });

    it('revokes the associated Invite if no other Memberships referencing it', async () => {
      await testSession
        .delete('/api/memberships/a7f434fa-81ae-4d8b-9d3b-d6a73959f1e1')
        .set('Accept', 'application/json')
        .expect(StatusCodes.NO_CONTENT);

      const record = await models.Membership.findByPk('a7f434fa-81ae-4d8b-9d3b-d6a73959f1e1');
      assert.deepStrictEqual(record, null);

      const invite = await models.Invite.findByPk('675ccf53-dcc3-4aac-a279-3e98f2d6e031');
      assert(invite.revokedAt);
      assert.deepStrictEqual(invite.RevokedByUserId, 'b9d53b71-faac-4ead-bbb6-745412b79bbf');
    });
  });
});
