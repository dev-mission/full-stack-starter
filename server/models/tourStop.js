const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TourStop extends Model {
    static associate(models) {
      TourStop.belongsTo(models.Tour);
      TourStop.belongsTo(models.Stop);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'TourId', 'StopId', 'position']);
      if (this.Tour) {
        json.Tour = this.Tour.toJSON();
      }
      if (this.Stop) {
        json.Stop = this.Stop.toJSON();
      }
      return json;
    }
  }

  TourStop.init(
    {
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'TourStop',
    }
  );

  return TourStop;
};
