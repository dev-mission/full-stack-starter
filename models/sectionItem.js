'use strict';

const {
  Model
} = require('sequelize');
const {DateTime} = require('luxon');

module.exports = (sequelize, DataTypes) => {
  class SectionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SectionItem.belongsTo(models.Section);
    }

    toJSON() {
      const data = this.get();
      if (data.startedAt) {
        data.startedAt = DateTime.fromISO(data.startedAt).toFormat('yyyy-MM');
      }
      if (data.endedAt) {
        data.endedAt = DateTime.fromISO(data.endedAt).toFormat('yyyy-MM');
      } else {
        data.endedAt = '';
      }
      return data;
    }
  };
  SectionItem.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter a title'
        }
      }
    },
    subtitle: DataTypes.STRING,
    place: DataTypes.STRING,
    about: DataTypes.TEXT,
    startedAt: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Please enter a valid start month and year (YYYY-MM)'
        },
        notEmpty: {
          msg: 'Please enter a valid start month and year (YYYY-MM)'
        }
      }
    },
    endedAt: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Please enter a valid start month and year (YYYY-MM)'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'SectionItem',
  });
  return SectionItem;
};
