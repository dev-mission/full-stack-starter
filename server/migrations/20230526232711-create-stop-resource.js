/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StopResources', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      StopId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Stops',
          key: 'id',
        },
      },
      ResourceId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Resources',
          key: 'id',
        },
      },
      start: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      end: {
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
    await queryInterface.addIndex('StopResources', ['StopId', 'ResourceId'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StopResources');
  },
};
