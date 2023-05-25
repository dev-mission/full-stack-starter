const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TourResource extends Model {
    static associate(models) {
      TourResource.belongsTo(models.Tour);
      TourResource.belongsTo(models.Resource);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'TourId', 'ResourceId', 'start', 'end']);
      if (this.Resource) {
        json.Resource = this.Resource.toJSON();
      }
      return json;
    }
  }

  TourResource.init(
    {
      start: DataTypes.STRING,
      end: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'TourResource',
    }
  );

  return TourResource;
};
