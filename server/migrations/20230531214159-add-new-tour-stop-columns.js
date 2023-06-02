/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tours', 'CoverResourceId', {
      type: Sequelize.UUID,
      references: {
        model: 'Resources',
        key: 'id',
      },
    });
    await queryInterface.addColumn('Tours', 'IntroStopId', {
      type: Sequelize.UUID,
      references: {
        model: 'Stops',
        key: 'id',
      },
    });
    await queryInterface.addColumn('Stops', 'type', {
      allowNull: false,
      type: Sequelize.ENUM('INTRO', 'STOP', 'TRANSITION'),
      defaultValue: 'STOP',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Stops', 'type');
    await queryInterface.removeColumn('Tours', 'IntroStopId');
    await queryInterface.removeColumn('Tours', 'CoverResourceId');
  },
};
