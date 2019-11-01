'use strict';

const bcrypt = require('bcrypt');
const sequelizePaginate = require('sequelize-paginate')
const uuid = require('uuid/v4');
const mailer = require('../emails/mailer');

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
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true
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
    passwordResetToken: {
      type: DataTypes.UUID,
      field: 'password_reset_token',
    },
    passwordResetTokenExpiresAt: {
      type: DataTypes.DATE,
      field: 'password_reset_token_expires_at',
    }
  }, {
    tableName: 'users',
    underscored: true
  });
  User.associate = function(models) {

    User.prototype.hashPassword = function(password, object) {
      return bcrypt.hash(password, 10).then(hashedPassword => {
        return this.update({hashedPassword: hashedPassword}, object);
      });
    }

    User.prototype.sendPasswordResetEmail = function() {
      return this.update({
        passwordResetToken: uuid(),
        passwordResetTokenExpiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }).then(function(user) {
        return mailer.send({
          template: 'password-reset',
          message: {
            to: `${user.firstName} ${user.lastName} <${user.email}>`
          },
          locals: {
            url: `${process.env.BASE_URL}/login/reset-password/${user.passwordResetToken}`
          }
        });
      });
    }
  };
  sequelizePaginate.paginate(User)
  return User;
};
