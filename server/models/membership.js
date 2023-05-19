const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      Membership.belongsTo(models.Team);
      Membership.belongsTo(models.User);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'TeamId', 'UserId', 'role']);
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
      role: DataTypes.ENUM('OWNER', 'VIEWER', 'EDITOR'),
    },
    {
      sequelize,
      modelName: 'Membership',
    }
  );

  return Membership;
};
