const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/teams', () => {
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

  describe('GET /', () => {
    it('returns a list of the Teams the User is a member of', async () => {
      const response = await testSession.get('/api/teams').set('Accept', 'application/json').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body.length, 1);
      assert.deepStrictEqual(response.body[0].name, "Regular's Personal Team");
    });
  });

  describe('POST /', () => {
    it('creates a new Team and makes the User the owner', async () => {
      const response = await testSession
        .post('/api/teams')
        .set('Accept', 'application/json')
        .send({
          name: 'New Team',
          link: 'newteam',
        })
        .expect(StatusCodes.CREATED);

      assert(response.body?.id);
      assert.deepStrictEqual(response.body?.Memberships?.length, 1);
      assert.deepStrictEqual(response.body.Memberships[0], {
        id: response.body.Memberships[0].id,
        TeamId: response.body.id,
        UserId: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
        InviteId: null,
        role: 'OWNER',
      });

      const record = await models.Team.findByPk(response.body.id);
      assert(record);
      assert.deepStrictEqual(record.name, 'New Team');
      assert.deepStrictEqual(record.link, 'newteam');

      const memberships = await record.getMemberships();
      assert.deepStrictEqual(memberships.length, 1);
      assert.deepStrictEqual(memberships[0].UserId, 'b9d53b71-faac-4ead-bbb6-745412b79bbf');
      assert.deepStrictEqual(memberships[0].role, 'OWNER');
    });

    it('validates the presence of the Team name', async () => {
      const response = await testSession
        .post('/api/teams')
        .set('Accept', 'application/json')
        .send({
          name: '',
          link: 'newteam',
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

    it('validates the uniqueness of the Team link', async () => {
      const response = await testSession
        .post('/api/teams')
        .set('Accept', 'application/json')
        .send({
          name: 'New Team',
          link: 'regularuser',
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      assert.deepStrictEqual(response.body, {
        errors: [
          {
            message: 'Link already taken',
            path: 'link',
            value: 'regularuser',
          },
        ],
        status: 422,
      });
    });

    it('validates the format of the Team link', async () => {
      const response = await testSession
        .post('/api/teams')
        .set('Accept', 'application/json')
        .send({
          name: 'New Team',
          link: 'invalid link',
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
    it('returns a Team by id', async () => {
      const response = await testSession
        .get('/api/teams/1a93d46d-89bf-463b-ab23-8f22f5777907')
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);

      const data = { ...response.body };
      assert.deepStrictEqual(data, {
        id: '1a93d46d-89bf-463b-ab23-8f22f5777907',
        name: "Regular's Personal Team",
        link: 'regularuser',
        variants: [
          {
            code: 'en-us',
            displayName: 'English',
            name: 'English (US)',
          },
        ],
        Memberships: [
          {
            InviteId: null,
            TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
            User: {
              email: 'regular.user@test.com',
              firstName: 'Regular',
              id: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
              isAdmin: false,
              lastName: 'User',
              picture: null,
              pictureURL: null,
            },
            UserId: 'b9d53b71-faac-4ead-bbb6-745412b79bbf',
            id: '5a313737-e5ff-48fd-ba6b-b82983a7a7bf',
            role: 'OWNER',
          },
          {
            InviteId: null,
            TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
            User: {
              email: 'another.user@test.com',
              firstName: 'Another',
              id: '124ea562-938d-44f4-b757-e4906eec2dc3',
              isAdmin: false,
              lastName: 'User',
              picture: null,
              pictureURL: null,
            },
            UserId: '124ea562-938d-44f4-b757-e4906eec2dc3',
            id: '886304d3-cb45-442f-8914-f7fad8b6781a',
            role: 'VIEWER',
          },
          {
            Invite: {
              AcceptedByUserId: null,
              CreatedByUserId: '552be152-a88b-43c0-b009-1a087caad67a',
              RevokedByUserId: null,
              acceptedAt: null,
              createdAt: '2022-01-29T22:59:56.000Z',
              email: 'invited.user.2@test.com',
              firstName: 'Invited',
              id: '675ccf53-dcc3-4aac-a279-3e98f2d6e031',
              lastName: 'User 2',
              message: 'This is an invitation to Invited User 2.',
              revokedAt: null,
              updatedAt: response.body?.Memberships[2]?.Invite?.updatedAt,
            },
            InviteId: '675ccf53-dcc3-4aac-a279-3e98f2d6e031',
            TeamId: '1a93d46d-89bf-463b-ab23-8f22f5777907',
            UserId: null,
            id: 'a7f434fa-81ae-4d8b-9d3b-d6a73959f1e1',
            role: 'VIEWER',
          },
        ],
      });
    });
  });

  describe('PATCH /:id', () => {
    it('updates a Team', async () => {
      const response = await testSession
        .patch('/api/teams/1a93d46d-89bf-463b-ab23-8f22f5777907')
        .send({
          name: 'Updated name',
          link: 'updated-link',
        })
        .set('Accept', 'application/json')
        .expect(StatusCodes.OK);

      assert.deepStrictEqual(response.body?.name, 'Updated name');
      assert.deepStrictEqual(response.body?.link, 'updated-link');

      const record = await models.Team.findByPk('1a93d46d-89bf-463b-ab23-8f22f5777907');
      assert.deepStrictEqual(record.name, 'Updated name');
      assert.deepStrictEqual(record.link, 'updated-link');
    });
  });
});
