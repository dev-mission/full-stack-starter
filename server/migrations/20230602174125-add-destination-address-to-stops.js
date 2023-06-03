/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Stops', 'destAddress', Sequelize.TEXT);
    await queryInterface.addColumn('Stops', 'destCoordinate', Sequelize.GEOGRAPHY);
    await queryInterface.addColumn('Stops', 'destRadius', Sequelize.DECIMAL);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Stops', 'destRadius');
    await queryInterface.removeColumn('Stops', 'destCoordinate');
    await queryInterface.removeColumn('Stops', 'destAddress');
  },
};
