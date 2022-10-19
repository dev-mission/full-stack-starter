const express = require('express');
const fs = require('fs-extra');
const HttpStatus = require('http-status-codes');
const mime = require('mime-types');
const path = require('path');
const { v4: uuid } = require('uuid');

const interceptors = require('../interceptors');
const s3 = require('../../lib/s3');

const router = express.Router();

router.post('/', interceptors.requireLogin, async (req, res) => {
  const id = uuid();
  const response = req.body.blob;
  response.id = id;
  response.key = id;
  response.metadata = {};
  response.created_at = new Date();
  if (!response.signed_id) {
    response.signed_id = `${id}.${mime.extension(response.content_type)}`;
  }
  if (process.env.AWS_S3_BUCKET) {
    /// store in S3, in tmp uploads dir
    const url = await s3.getSignedUploadUrl(response.content_type, `uploads/${response.signed_id}`);
    response.direct_upload = {
      url,
      headers: {
        'x-amz-acl': 'private',
        'x-amz-server-side-encryption': 'AES256',
        'Content-Type': response.content_type,
      },
    };
  } else {
    response.direct_upload = {
      url: `/api/assets/${response.signed_id}`,
      headers: {
        'Content-Type': response.content_type,
      },
    };
  }
  res.json(response);
});

router.put('/:path([^?]+)', interceptors.requireLogin, (req, res) => {
  const tmpDir = path.resolve(__dirname, '../../tmp/uploads');
  const tmpFile = path.resolve(tmpDir, `${req.params.path}`);
  fs.ensureDirSync(path.dirname(tmpFile));
  fs.writeFile(tmpFile, req.body, (err) => {
    if (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    } else {
      res.status(HttpStatus.OK).end();
    }
  });
});

router.get('/:path([^?]+)', async (req, res) => {
  let { path: assetPath } = req.params;
  if (process.env.ASSET_PATH_PREFIX) {
    assetPath = path.join(process.env.ASSET_PATH_PREFIX, assetPath);
  }
  if (process.env.AWS_S3_BUCKET) {
    const url = await s3.getSignedAssetUrl(assetPath, 900);
    res.set('Cache-Control', 'public, max-age=845');
    res.redirect(url);
  } else {
    res.redirect(`/assets/${assetPath}`);
  }
});

module.exports = router;
