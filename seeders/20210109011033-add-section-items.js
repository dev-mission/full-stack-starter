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
        title: 'Minerva Schools at KGI',
        subtitle: "Bachelor's Degree, Computational Sciences",
        place: 'San Francisco, CA',
        about: `Relevant coursework: Python Programming, Data Visualizations, Design Thinking, System Dynamics`,
        startedAt: 'Sept 2018',
        endedAt: 'May 2022',
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
