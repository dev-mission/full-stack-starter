'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const now = new Date();
    await queryInterface.bulkInsert('Sections', [
      {
        id: 1,
        name: 'Education',
        slug: 'education',
        position: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Work Experience',
        slug: 'work',
        position: 2,
        createdAt: now,
        updatedAt: now
      }
    ]);
    await queryInterface.sequelize.query(`SELECT setval('"Sections_id_seq"', (SELECT MAX(id) FROM "Sections"))`);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Sections');
  }
};
