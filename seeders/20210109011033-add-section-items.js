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
    await queryInterface.bulkInsert('SectionItems', [
      {
        SectionId: 1,
        title: 'Dev/Mission',
        subtitle: "Pre-apprenticeship Bootcamp",
        place: 'San Francisco, CA',
        about: `Here's something about this.`,
        startedAt: '2020-09',
        endedAt: '2020-12',
        createdAt: now,
        updatedAt: now
      },
      {
        SectionId: 2,
        title: 'My Employer',
        subtitle: 'My Position',
        place: 'San Francisco, CA',
        about: `Here's what I do at this job.`,
        startedAt: '2021-01-01',
        endedAt: null,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SectionItems');
  }
};
