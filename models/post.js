'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    from: DataTypes.STRING,
    title: DataTypes.STRING,
    full_text: DataTypes.TEXT,
    media_url: DataTypes.STRING
  }, {
    tableName: 'posts',
    underscored: true
  });
  Post.associate = function(models) {
    // associations can be defined here
  };
  return Post;
};
