const _ = require('lodash');
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate(models) {
      Tour.belongsTo(models.Team);
      Tour.belongsTo(models.Resource, { as: 'CoverResource' });
      Tour.belongsTo(models.Stop, { as: 'IntroStop' });
      Tour.hasMany(models.TourStop);
    }

    toJSON() {
      const json = _.pick(this.get(), [
        'id',
        'TeamId',
        'CoverResourceId',
        'IntroStopId',
        'link',
        'names',
        'descriptions',
        'variants',
        'visibility',
      ]);
      if (this.CoverResource) {
        json.CoverResource = this.CoverResource.toJSON();
      }
      if (this.IntroStop) {
        json.IntroStop = this.IntroStop.toJSON();
      }
      if (this.Team) {
        json.Team = this.Team.toJSON();
      }
      if (this.TourStops) {
        json.TourStops = this.TourStops.map((ts) => ts.toJSON());
      }
      return json;
    }
  }

  Tour.init(
    {
      link: {
        type: DataTypes.CITEXT,
        validate: {
          notEmpty: {
            msg: 'Link cannot be blank',
          },
          async isUnique(value) {
            if (this.changed('link')) {
              const record = await Tour.findOne({
                where: {
                  id: {
                    [Op.ne]: this.id,
                  },
                  TeamId: this.TeamId,
                  link: value,
                },
              });
              if (record) {
                throw new Error('Link already taken');
              }
            }
          },
          is: {
            args: [/^[A-Za-z0-9-]+$/],
            msg: 'Letters, numbers, and hyphen only',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Name cannot be blank',
          },
        },
      },
      names: DataTypes.JSONB,
      descriptions: DataTypes.JSONB,
      variants: DataTypes.JSONB,
      visibility: DataTypes.ENUM('PUBLIC', 'UNLISTED', 'PRIVATE'),
    },
    {
      sequelize,
      modelName: 'Tour',
    }
  );

  Tour.beforeValidate((record) => {
    const [variant] = record.variants;
    record.name = record.names[variant.code] ?? '';
  });

  return Tour;
};
