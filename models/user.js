'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
const _ = require('lodash');
const sequelizePaginate = require('sequelize-paginate')
const uuid = require('uuid/v4');
const mailer = require('../emails/mailer');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static isValidPassword(password) {
      return password.match(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,30}$/) != null;
    }

    toJSON() {
      return _.pick(this.get(), [
        'id',
        'firstName',
        'lastName',
        'email'
      ]);
    }

    hashPassword(password, options) {
      return bcrypt.hash(password, 10).then(hashedPassword => {
        return this.update({hashedPassword: hashedPassword, passwordResetTokenExpiresAt: new Date()}, options);
      });
    }

    sendPasswordResetEmail() {
      return this.update({
        passwordResetToken: uuid(),
        passwordResetTokenExpiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }).then((user) => {
        return mailer.send({
          template: 'password-reset',
          message: {
            to: this.fullNameAndEmail
          },
          locals: {
            url: `${process.env.BASE_URL}/passwords/reset/${user.passwordResetToken}`
          }
        });
      });
    }

    sendWelcomeEmail() {
      return mailer.send({
        template: 'welcome',
        message: {
          to: this.fullNameAndEmail
        }
      });
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.CITEXT,
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
    fullNameAndEmail: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName} <${this.email}>`;
      }
    },
    hashedPassword: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deactivatedAt: {
      type: DataTypes.DATE
    },
    passwordResetToken: {
      type: DataTypes.UUID
    },
    passwordResetTokenExpiresAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  sequelizePaginate.paginate(User)
  return User;
};
