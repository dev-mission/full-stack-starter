'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
      .then(() => queryInterface.createTable('users', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        first_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        last_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING
        },
        hashed_password: {
          type: Sequelize.STRING
        },
        is_admin: {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN
        },
        deactivated_at: {
          type: Sequelize.DATE
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }))
      .then(() => queryInterface.addIndex('users', {
        fields: [Sequelize.fn('lower', Sequelize.col('email'))],
        unique: true,
        name: 'users_email_idx'
      }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
