const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StopResource extends Model {
    static associate(models) {
      StopResource.belongsTo(models.Stop);
      StopResource.belongsTo(models.Resource);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'StopId', 'ResourceId', 'start', 'end']);
      if (this.Resource) {
        json.Resource = this.Resource.toJSON();
      }
      return json;
    }
  }
  StopResource.init(
    {
      start: DataTypes.STRING,
      end: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'StopResource',
    }
  );
  return StopResource;
};
