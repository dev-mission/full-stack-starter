import {
  S3Client,
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as getSignedS3Url } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getSignedCloudFrontUrl } from '@aws-sdk/cloudfront-signer';
import fs from 'fs';
import { DateTime } from 'luxon';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let client;
let signerClient;
if (process.env.AWS_S3_ENDPOINT) {
  const options = {
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_S3_ENDPOINT,
    region: process.env.AWS_S3_REGION,
    forcePathStyle: true,
  };
  client = new S3Client(options);
  if (process.env.AWS_S3_SIGNER_ENDPOINT) {
    signerClient = new S3Client({
      ...options,
      endpoint: process.env.AWS_S3_SIGNER_ENDPOINT,
    });
  }
}

function copyObject(CopySource, Key) {
  return client.send(
    new CopyObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      CopySource,
      Key,
    })
  );
}

function createBucket(Bucket) {
  return client.send(
    new CreateBucketCommand({
      Bucket,
    })
  );
}

function deleteObject(Key) {
  return client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key,
    })
  );
}

async function deleteObjects(Prefix) {
  const response = await client.send(
    new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix,
    })
  );
  if (response.Contents) {
    return client.send(
      new DeleteObjectsCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: {
          Objects: response.Contents.map((obj) => ({ Key: obj.Key })),
        },
      })
    );
  }
  return Promise.resolve();
}

async function getObject(Key) {
  const response = await client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key,
    })
  );
  const filePath = path.resolve(__dirname, '../tmp/downloads', Key);
  const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
  await fs.promises.mkdir(dirPath, { recursive: true });
  return fs.promises.writeFile(filePath, response.Body);
}

function getSignedAssetUrl(Key, expiresIn = 60) {
  if (process.env.AWS_CLOUDFRONT_DOMAIN) {
    const url = `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${Key}`;
    const keyPairId = process.env.AWS_CLOUDFRONT_KEYPAIR_ID;
    const privateKey = process.env.AWS_CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n');
    const dateLessThan = DateTime.now().plus({ seconds: expiresIn }).toISO();
    return getSignedCloudFrontUrl({ url, keyPairId, privateKey, dateLessThan });
  }
  return getSignedS3Url(
    signerClient ?? client,
    new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key,
    }),
    { expiresIn }
  );
}

function getSignedUploadUrl(ContentType, Key) {
  return getSignedS3Url(
    signerClient ?? client,
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType,
      Key,
    })
  );
}

async function objectExists(Key) {
  try {
    const response = await client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key,
      })
    );
    return response !== null;
  } catch (err) {
    return false;
  }
}

function putObject(Key, filePath) {
  return client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key,
      Body: fs.createReadStream(filePath),
    })
  );
}

export default {
  copyObject,
  createBucket,
  deleteObject,
  deleteObjects,
  getObject,
  getSignedAssetUrl,
  getSignedUploadUrl,
  objectExists,
  putObject,
};
