/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memberships', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      TeamId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Teams',
          key: 'id',
        },
      },
      UserId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('OWNER', 'VIEWER', 'EDITOR'),
        defaultValue: 'VIEWER',
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
    await queryInterface.addIndex('Memberships', ['TeamId', 'UserId'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Memberships');
  },
};
