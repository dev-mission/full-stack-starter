/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Files', 'duration', Sequelize.INTEGER);
    await queryInterface.addColumn('Files', 'width', Sequelize.INTEGER);
    await queryInterface.addColumn('Files', 'height', Sequelize.INTEGER);
    await queryInterface.addColumn('Files', 'originalName', Sequelize.STRING);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Files', 'originalName');
    await queryInterface.removeColumn('Files', 'height');
    await queryInterface.removeColumn('Files', 'width');
    await queryInterface.removeColumn('Files', 'duration');
  },
};
