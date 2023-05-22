/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tours', {
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
      link: {
        allowNull: false,
        type: Sequelize.CITEXT,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      names: {
        allowNull: false,
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      descriptions: {
        allowNull: false,
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      variants: {
        allowNull: false,
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      visibility: {
        allowNull: false,
        type: Sequelize.ENUM('PUBLIC', 'UNLISTED', 'PRIVATE'),
        defaultValue: 'PRIVATE',
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
    await queryInterface.addIndex('Tours', ['TeamId', 'link'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tours');
  },
};
