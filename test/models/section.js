const assert = require('assert');

const helper = require('../helper');
const models = require('../../models');

describe('models.Section', () => {
  beforeEach(async () => {
    await helper.loadFixtures([]);
  });

  it('creates a new Section record', async () => {
    let section = models.Section.build({
      name: 'Test Section',
      slug: 'test-section',
      position: 1
    });
    assert.strictEqual(section.id, null);
    await section.save()
    assert(section.id);

    section = await models.Section.findByPk(section.id);
    assert.strictEqual(section.name, 'Test Section');
    assert.strictEqual(section.slug, 'test-section');
    assert.strictEqual(section.position, 1);
  });
});
