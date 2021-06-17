'use strict';

const _ = require('lodash');
const AWS = require('aws-sdk');
const fs = require('fs-extra');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// add some helpers to the Sequelize Model class for handling file attachments

const s3options = {};
if (process.env.AWS_ACCESS_KEY_ID) {
  s3options.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
}
if (process.env.AWS_SECRET_ACCESS_KEY) {
  s3options.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}
if (process.env.AWS_S3_BUCKET_REGION) {
  s3options.region = process.env.AWS_S3_BUCKET_REGION;
}
const s3 = new AWS.S3(s3options);

Sequelize.Model.prototype.assetUrl = function(attribute, pathPrefix) {
  const file = this.get(attribute);
  if (file) {
    return path.resolve('/api/assets/', pathPrefix, file);
  }
  return null;
}

Sequelize.Model.prototype.handleAssetFile = async function(attribute, pathPrefix, options) {
  if (!this.changed(attribute)) {
    return;
  }
  const prevFile = this.previous(attribute);
  const newFile = this.get(attribute);
  const handle = async () => {
    if (process.env.AWS_S3_BUCKET) {
      if (prevFile) {
        await s3
          .deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: path.join(pathPrefix, prevFile),
          })
          .promise();
      }
      if (newFile) {
        await s3
          .copyObject({
            ACL: 'private',
            Bucket: process.env.AWS_S3_BUCKET,
            CopySource: path.join(process.env.AWS_S3_BUCKET, 'uploads', newFile),
            Key: path.join(pathPrefix, newFile),
            ServerSideEncryption: 'AES256',
          })
          .promise();
        await s3
          .deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: path.join('uploads', newFile),
          })
          .promise();
      }
    } else {
      if (prevFile) {
        fs.removeSync(path.resolve(__dirname, '../public/assets', pathPrefix, prevFile));
      }
      if (newFile) {
        fs.ensureDirSync(path.resolve(__dirname, '../public/assets'));
        fs.moveSync(
          path.resolve(__dirname, '../tmp/uploads', newFile),
          path.resolve(__dirname, '../public/assets', pathPrefix, newFile),
          { overwrite: true }
        );
      }
    }
  };
  if (options.transaction) {
    options.transaction.afterCommit(() => handle());
  } else {
    await handle();
  }
}

module.exports = db;
