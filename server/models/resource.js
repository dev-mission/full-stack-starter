const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    static associate(models) {
      Resource.belongsTo(models.Team);
      Resource.hasMany(models.File);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'TeamId', 'name', 'type', 'variants']);
      if (this.Files) {
        json.Files = this.Files.map((f) => f.toJSON());
      }
      return json;
    }
  }
  Resource.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: 'Name is required',
          },
          notEmpty: {
            msg: 'Name cannot be blank',
          },
        },
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM('AR_LINK', 'AUDIO', 'IMAGE', 'LINK', 'VIDEO'),
        validate: {
          notNull: {
            msg: 'Type is required',
          },
          notEmpty: {
            msg: 'Type cannot be blank',
          },
        },
      },
      variants: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Resource',
    }
  );
  return Resource;
};
