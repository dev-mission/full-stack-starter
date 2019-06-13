'use strict';

const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
      validate: {
        notNull: {
          msg: 'First name cannot be blank'
        },
        notEmpty: {
          msg: 'First name cannot be blank'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
      validate: {
        notNull: {
          msg: 'Last name cannot be blank'
        },
        notEmpty: {
          msg: 'Last name cannot be blank'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email cannot be blank'
        },
        notEmpty: {
          msg: 'Email cannot be blank'
        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      field: 'hashed_password',
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_admin',
    },
    deactivatedAt: {
      type: DataTypes.DATE,
      field: 'deactivated_at',
    },
  }, {
    tableName: 'users',
    underscored: true
  });
  User.associate = function(models) {
  };
  sequelizePaginate.paginate(User)
  return User;
};
