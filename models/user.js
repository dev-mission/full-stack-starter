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
    User.isValidPassword = function(password) {
      return password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) != null;
    };

    User.prototype.hashPassword = function(password, object) {
      return bcrypt.hash(password, 10).then(hashedPassword => {
        return this.update({hashedPassword: hashedPassword, passwordResetTokenExpiresAt: new Date()}, object);
      });
    };

    User.prototype.fullNameAndEmail = function() {
      return `${this.firstName} ${this.lastName} <${this.email}>`
    };

    User.prototype.sendPasswordResetEmail = function() {
      return this.update({
        passwordResetToken: uuid(),
        passwordResetTokenExpiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }).then(function(user) {
        return mailer.send({
          template: 'password-reset',
          message: {
            to: `${this.fullNameAndEmail()}`
          },
          locals: {
            url: `${process.env.BASE_URL}/passwords/reset/${user.passwordResetToken}`
          }
        });
      });
    };

    User.prototype.sendWelcomeEmail = function() {
      return mailer.send({
        template: 'welcome',
        message: {
          to: `${this.fullNameAndEmail()}`
        }
      });
    }
  };
  sequelizePaginate.paginate(User)
  return User;
};
