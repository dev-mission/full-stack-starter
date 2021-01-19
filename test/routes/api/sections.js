const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/sections', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['sections', 'users']);
    testSession = session(app);
  });

  describe('GET /', () => {
    it('returns a list of Sections ordered by position', async () => {
      /// request user list
      const response = await testSession
        .get('/api/sections')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      assert(response.body?.length, 3);

      const sections = response.body;
      assert.strictEqual(sections[0].name, 'Section 1');
      assert.strictEqual(sections[0].position, 1);
      assert.strictEqual(sections[1].name, 'Section 2');
      assert.strictEqual(sections[1].position, 2);
      assert.strictEqual(sections[2].name, 'Section 3');
      assert.strictEqual(sections[2].position, 3);
    });
  });

  describe('GET /:id', () => {
    it('returns the Section specified by the id', async () => {
      const response = await testSession
        .get('/api/sections/1')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      assert(response.body);
      
      const section = response.body;
      assert.strictEqual(section.name, 'Section 1');
      assert.strictEqual(section.slug, 'section-1');
      assert.strictEqual(section.position, 1);
    });
  });

  context('authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);
    });

    describe('POST /', () => {
      it('creates a new Section', async () => {
        const response = await testSession
          .post('/api/sections')
          .set('Accept', 'application/json')
          .send({
            name: 'Section 4',
            slug: 'section-4',
            position: 4
          })
          .expect(HttpStatus.CREATED);
        assert(response.body.id);
        
        const section = await models.Section.findByPk(response.body.id);
        assert.strictEqual(section.name, 'Section 4');
        assert.strictEqual(section.slug, 'section-4');
        assert.strictEqual(section.position, 4);
      });
    });

    describe('PATCH /:id', () => {
      it('updates an existing Section specified by id', async () => {
        const section = await models.Section.findByPk(1);
        assert.strictEqual(section.name, 'Section 1');
        assert.strictEqual(section.slug, 'section-1');
        assert.strictEqual(section.position, 1);  

        const response = await testSession
          .patch('/api/sections/1')
          .set('Accept', 'application/json')
          .send({
            name: 'Section 4',
            slug: 'section-4',
            position: 4
          })
          .expect(HttpStatus.OK);
        
        await section.reload();
        assert.strictEqual(section.name, 'Section 4');
        assert.strictEqual(section.slug, 'section-4');
        assert.strictEqual(section.position, 4);
      });
    });

    describe('DELETE /:id', () => {
      it('deletes an existing Section specified by id', async () => {
        const response = await testSession
          .delete('/api/sections/1')
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);
        
        const section = await models.Section.findByPk(1);
        assert.strictEqual(section, null);
      });
    });
  });
});
