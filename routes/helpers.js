'use strict';

const AWS = require('aws-sdk');
const _ = require('lodash');
const fs = require('fs-extra');
const inflection = require('inflection');
const mime = require('mime-types');
const path = require('path');

module.exports.register = function(res, errors) {
  res.locals.inflection = inflection;

  const hasError = function(name) {
    return _.find(errors, e => e.path == name) !== undefined;
  };
  res.locals.hasError = hasError;

  const errorMessages = function(name) {
    return _.uniq(_.map(_.filter(errors, e => e.path == name), e => e.message));
  };
  res.locals.errorMessages = errorMessages;

  res.locals.renderErrorMessages = function(name) {
    if (hasError(name)) {
      return `<div class="invalid-feedback d-block">${inflection.capitalize(errorMessages(name).join(', '))}.</div>`
    }
    return '';
  }
}

module.exports.assetHelpers = function(req, res, next) {
  res.locals.assetUrl = function(urlPath) {
    return `${process.env.ASSET_HOST}${urlPath}`;
  };
  next();
}

module.exports.handleUpload = function(record, paramName, newValue, destDir) {
  return new Promise(function(resolve, reject) {
    if (record[paramName] == newValue) {
      resolve(record);
      return;
    }
    if (process.env.AWS_S3_BUCKET) {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_S3_BUCKET_REGION
      });
      if (newValue) {
        //// move out of tmp
        const params = {
          CopySource: path.join('/', process.env.AWS_S3_BUCKET, 'uploads', newValue),
          Bucket: process.env.AWS_S3_BUCKET,
          Key: path.join(destDir, newValue),
          ACL: 'public-read'
        };
        s3.copyObject(params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            //// delete existing file, if any
            if (record[paramName]) {
              s3.deleteObject({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: record[paramName]
              }, function(err, data) {
                //// done! update pictureUrl with hostname
                record[paramName] = path.join(destDir, newValue);
                resolve(record);
              });
            } else {
              //// done! update pictureUrl with hostname
              record[paramName] = path.join(destDir, newValue);
              resolve(record);
            }
          }
        });
      } else {
        if (record[paramName]) {
          s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: record[paramName]
          }, function(err, data) {
            //// done! update pictureUrl with hostname
            record[paramName] = null;
            resolve(record);
          });
        } else {
          record[paramName] = null;
          resolve(record);
        }
      }
    } else {
      if (newValue) {
        const tmpPath = path.resolve(__dirname, '../tmp/uploads', newValue);
        const destPath = path.resolve(__dirname, '../public/uploads', destDir, newValue);
        fs.move(tmpPath, destPath, {overwrite: true}, function(err) {
          if (err) {
            reject(err);
          } else {
            let prevValue = record[paramName];
            if (prevValue) {
              fs.removeSync(path.resolve('../public', prevValue));
            }
            record[paramName] = path.join('/uploads', destDir, newValue);
            resolve(record);
          }
        });
      } else {
        let prevValue = record[paramName];
        if (prevValue) {
          fs.removeSync(path.resolve('../public', prevValue));
        }
        record[paramName] = null;
        resolve(record);
      }
    }
  });
}
