import express from 'express';
import fs from 'fs-extra';
import { StatusCodes } from 'http-status-codes';
import mime from 'mime-types';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';

import interceptors from '../interceptors.js';
import s3 from '../../lib/s3.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    } else {
      res.status(StatusCodes.OK).end();
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

export default router;
