const bcrypt = require('bcrypt');
const { Model, Op } = require('sequelize');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const mailer = require('../emails/mailer');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }

    static isValidPassword(password) {
      return password.match(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,30}$/) != null;
    }

    authenticate(password) {
      return bcrypt.compare(password, this.hashedPassword);
    }

    toJSON() {
      return _.pick(this.get(), ['id', 'firstName', 'lastName', 'email', 'picture', 'pictureUrl', 'isAdmin']);
    }

    hashPassword(password, options) {
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => this.update({ hashedPassword, passwordResetTokenExpiresAt: new Date() }, options));
    }

    sendPasswordResetEmail() {
      return this.update({
        passwordResetToken: uuid(),
        passwordResetTokenExpiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      }).then((user) =>
        mailer.send({
          template: 'password-reset',
          message: {
            to: this.fullNameAndEmail,
          },
          locals: {
            url: `${process.env.BASE_URL}/passwords/reset/${user.passwordResetToken}`,
          },
        })
      );
    }

    sendWelcomeEmail() {
      return mailer.send({
        template: 'welcome',
        message: {
          to: this.fullNameAndEmail,
        },
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'First name cannot be blank',
          },
          notEmpty: {
            msg: 'First name cannot be blank',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Last name cannot be blank',
          },
          notEmpty: {
            msg: 'Last name cannot be blank',
          },
        },
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Email cannot be blank',
          },
          notEmpty: {
            msg: 'Email cannot be blank',
          },
          async isUnique(value) {
            if (this.changed('email')) {
              const user = await User.findOne({
                where: {
                  id: {
                    [Op.ne]: this.id,
                  },
                  email: value,
                },
              });
              if (user) {
                throw new Error('Email already registered');
              }
            }
          },
        },
      },
      fullNameAndEmail: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName} <${this.email}>`;
        },
      },
      password: {
        type: DataTypes.VIRTUAL,
        validate: {
          isStrong(value) {
            if (this.hashedPassword && this.password === '') {
              // not changing, skip validation
              return;
            }
            if (value.match(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,30}$/) == null) {
              throw new Error('Minimum eight characters, at least one letter and one number');
            }
          },
        },
      },
      hashedPassword: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.STRING,
      },
      pictureUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.assetUrl('picture');
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deactivatedAt: {
        type: DataTypes.DATE,
      },
      passwordResetToken: {
        type: DataTypes.UUID,
      },
      passwordResetTokenExpiresAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.beforeSave(async (user) => {
    if (user.changed('password') && user.password !== '') {
      user.hashedPassword = await bcrypt.hash(user.password, 12);
      user.password = null;
      user.passwordResetToken = null;
      user.passwordResetTokenExpiresAt = null;
    }
  });

  User.afterSave(async (user, options) => {
    user.handleAssetFile('picture', options);
  });

  return User;
};
