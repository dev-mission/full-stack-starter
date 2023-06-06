/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Invites', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Invites', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Invites', 'message', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Invites', 'message', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn('Invites', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('Invites', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
