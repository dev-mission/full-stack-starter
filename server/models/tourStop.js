const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TourStop extends Model {
    static associate(models) {
      TourStop.belongsTo(models.Tour);
      TourStop.belongsTo(models.Stop);
      TourStop.belongsTo(models.Stop, { as: 'TransitionStop' });
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'TourId', 'StopId', 'TransitionStopId', 'position']);
      if (this.Tour) {
        json.Tour = this.Tour.toJSON();
      }
      if (this.Stop) {
        json.Stop = this.Stop.toJSON();
      }
      if (this.TransitionStop) {
        json.TransitionStop = this.TransitionStop.toJSON();
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
