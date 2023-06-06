const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/files', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadUploads([
      ['512x512.png', 'b45136f4-54e4-45cd-8851-efc9d733a573.png'],
      ['512x512.png', 'cdd8007d-dcaf-4163-b497-92d378679668.png'],
      ['00-04.m4a', 'd2e150be-b277-4f68-96c7-22a477e0022f.m4a'],
    ]);
    await helper.loadFixtures(['users', 'invites', 'teams', 'memberships', 'resources', 'files']);
    testSession = session(app);
    await testSession
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'regular.user@test.com', password: 'abcd1234' })
      .expect(StatusCodes.OK);
  });

  afterEach(async () => {
    await helper.cleanAssets();
  });

  describe('PATCH /:id', () => {
    it('updates a File by id', async () => {
      const response = await testSession
        .patch('/api/files/ed2f158a-e44e-432d-971e-e5da1a2e33b4')
        .set('Accept', 'application/json')
        .send({
          key: 'b45136f4-54e4-45cd-8851-efc9d733a573.png',
        })
        .expect(StatusCodes.OK);

      const data = { ...response.body };
      assert.deepStrictEqual(data, {
        id: 'ed2f158a-e44e-432d-971e-e5da1a2e33b4',
        ResourceId: '0cb2ce76-c5ca-454f-9fb1-47051b0f21ab',
        variant: 'en-us',
        externalURL: null,
        key: 'b45136f4-54e4-45cd-8851-efc9d733a573.png',
        keyURL: '/api/assets/files/ed2f158a-e44e-432d-971e-e5da1a2e33b4/key/b45136f4-54e4-45cd-8851-efc9d733a573.png',
        originalName: null,
        duration: null,
        width: null,
        height: null,
        URL: '/api/assets/files/ed2f158a-e44e-432d-971e-e5da1a2e33b4/key/b45136f4-54e4-45cd-8851-efc9d733a573.png',
      });
      await helper.sleep(100);
      assert(
        await helper.assetPathExists(
          path.join('files', 'ed2f158a-e44e-432d-971e-e5da1a2e33b4', 'key', 'b45136f4-54e4-45cd-8851-efc9d733a573.png')
        )
      );
    });
  });
});
