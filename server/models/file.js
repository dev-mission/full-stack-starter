const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.Resource);
    }

    toJSON() {
      const json = _.pick(this.get(), [
        'id',
        'ResourceId',
        'variant',
        'externalURL',
        'key',
        'keyURL',
        'originalName',
        'duration',
        'width',
        'height',
        'URL',
      ]);
      return json;
    }
  }

  File.init(
    {
      variant: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: 'Variant is required',
          },
          notEmpty: {
            msg: 'Variant cannot be blank',
          },
        },
      },
      externalURL: DataTypes.TEXT,
      key: DataTypes.TEXT,
      keyURL: {
        type: DataTypes.VIRTUAL(DataTypes.TEXT, ['key']),
        get() {
          return this.assetUrl('key');
        },
      },
      originalName: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      URL: {
        type: DataTypes.VIRTUAL(DataTypes.TEXT, ['externalURL', 'key']),
        get() {
          return this.externalURL ? this.externalURL : this.keyURL;
        },
      },
    },
    {
      sequelize,
      modelName: 'File',
    }
  );

  File.afterSave(async (file, options) => {
    file.handleAssetFile('key', options);
  });

  File.afterDestroy(async (file, options) => {
    file.key = null;
    file.handleAssetFile('key', options);
  });

  return File;
};
