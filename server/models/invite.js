const { Model } = require('sequelize');
const _ = require('lodash');
const mailer = require('../emails/mailer');

module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Invite.belongsTo(models.User, { as: 'AcceptedByUser' });
      Invite.belongsTo(models.User, { as: 'RevokedByUser' });
      Invite.belongsTo(models.User, { as: 'CreatedByUser' });
    }

    toJSON() {
      const json = _.pick(this.get(), [
        'id',
        'firstName',
        'lastName',
        'email',
        'message',
        'createdAt',
        'CreatedByUserId',
        'acceptedAt',
        'AcceptedByUserId',
        'revokedAt',
        'RevokedByUserId',
        'updatedAt',
      ]);
      return json;
    }

    sendInviteEmail() {
      return mailer.send({
        template: 'invite',
        message: {
          to: this.fullNameAndEmail,
        },
        locals: {
          firstName: this.firstName,
          url: `${process.env.BASE_URL}/invites/${this.id}`,
          message: this.message,
        },
      });
    }
  }

  Invite.init(
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
        },
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`.trim();
        },
      },
      fullNameAndEmail: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.fullName} <${this.email}>`;
        },
      },
      message: DataTypes.TEXT,
      acceptedAt: DataTypes.DATE,
      revokedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Invite',
    }
  );
  return Invite;
};
