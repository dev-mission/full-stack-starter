const _ = require('lodash');
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      Team.hasMany(models.Membership);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'link', 'name', 'variants']);
      if (this.Memberships) {
        json.Memberships = this.Memberships.map((m) => m.toJSON());
      }
      return json;
    }
  }

  Team.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Name cannot be blank',
          },
        },
      },
      link: {
        type: DataTypes.CITEXT,
        validate: {
          notEmpty: {
            msg: 'Link cannot be blank',
          },
          async isUnique(value) {
            if (this.changed('link')) {
              const record = await Team.findOne({
                where: {
                  id: {
                    [Op.ne]: this.id,
                  },
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
      variants: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Team',
    }
  );

  return Team;
};
