/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION iF NOT EXISTS postgis');
    await queryInterface.createTable('Stops', {
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
      address: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      coordinate: {
        type: Sequelize.GEOGRAPHY,
      },
      radius: {
        type: Sequelize.DECIMAL,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('Stops', ['TeamId', 'link'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stops');
  },
};
