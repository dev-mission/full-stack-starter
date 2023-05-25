/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Files', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      ResourceId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Resources',
          key: 'id',
        },
      },
      variant: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      externalURL: {
        type: Sequelize.TEXT,
      },
      key: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('Files', ['ResourceId', 'variant'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Files');
  },
};
