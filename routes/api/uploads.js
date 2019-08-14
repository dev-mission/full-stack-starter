'use strict';

const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');
const fs = require('fs');
const mime = require('mime-types');
const mkdirp = require('mkdirp');
const path = require('path');
const uuid = require('uuid/v4');

const models = require('../../models');
const interceptors = require('../interceptors');

router.post('/', interceptors.requireAdmin, function(req, res, next) {
  const id = uuid();
  let response = req.body.blob;
  response.id = id;
  response.key = id;
  response.metadata = {};
  response.created_at = new Date();
  response.signed_id = `${id}.${mime.extension(response.content_type)}`;
  if (process.env.AWS_S3_BUCKET) {
    //// store in S3, in tmp uploads dir
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_BUCKET_REGION
    });
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${id}.${mime.extension(response.content_type)}`,
      ContentType: response.content_type
    };
    const url = s3.getSignedUrl('putObject', params);
    response.direct_upload = {
      url: url,
      headers: {
        'Content-Type': response.content_type
      }
    };
  } else {
    response.direct_upload = {
      url: `/api/uploads/${id}`,
      headers: {
        'Content-Type': response.content_type
      }
    };
  }
  res.json(response);
});

router.put('/:id', interceptors.requireAdmin, function(req, res, next) {
  const tmpDir = path.resolve(__dirname, '../../tmp/uploads');
  mkdirp.sync(tmpDir);
  fs.writeFile(path.resolve(tmpDir, `${req.params.id}.${mime.extension(req.get('Content-Type'))}`), req.body, function(err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
