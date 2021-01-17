'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SectionItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SectionId: {
        references: {
          model: {
            tableName: 'Sections'
          },
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      place: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.TEXT
      },
      startedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      endedAt: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SectionItems');
  }
};
