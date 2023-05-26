/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TourStops', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      TourId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Tours',
          key: 'id',
        },
      },
      StopId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Stops',
          key: 'id',
        },
      },
      position: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('TourStops', ['TourId', 'StopId'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TourStops');
  },
};
