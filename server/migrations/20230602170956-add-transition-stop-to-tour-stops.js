/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('TourStops', 'TransitionStopId', {
      type: Sequelize.UUID,
      references: {
        model: 'Stops',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('TourStops', 'TransitionStopId');
  },
};
