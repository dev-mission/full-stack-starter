const _ = require('lodash');
const { Model } = require('sequelize');

const ROLE_OWNER = 'OWNER';
const ROLE_VIEWER = 'VIEWER';
const ROLE_EDITOR = 'EDITOR';
const ROLES = [ROLE_OWNER, ROLE_VIEWER, ROLE_EDITOR];
Object.freeze(ROLES);

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    get isOwner() {
      return this.role === ROLE_OWNER;
    }

    get isEditor() {
      return this.role !== ROLE_VIEWER;
    }

    static associate(models) {
      Membership.belongsTo(models.Invite);
      Membership.belongsTo(models.Team);
      Membership.belongsTo(models.User);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'InviteId', 'TeamId', 'UserId', 'role']);
      if (this.Invite) {
        json.Invite = this.Invite.toJSON();
      }
      if (this.Team) {
        json.Team = this.Team.toJSON();
      }
      if (this.User) {
        json.User = this.User.toJSON();
      }
      return json;
    }
  }

  Membership.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      role: DataTypes.ENUM(ROLES),
    },
    {
      sequelize,
      modelName: 'Membership',
    }
  );

  return Membership;
};
