const AWS = require('aws-sdk');
const fs = require('fs-extra');
const path = require('path');

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

let cf;
if (process.env.AWS_CLOUDFRONT_DOMAIN) {
  const privateKey = process.env.AWS_CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n');
  cf = new AWS.CloudFront.Signer(process.env.AWS_CLOUDFRONT_KEYPAIR_ID, privateKey);
}

function copyObject(CopySource, Key) {
  return s3
    .copyObject({
      ACL: 'private',
      Bucket: process.env.AWS_S3_BUCKET,
      CopySource,
      Key,
      ServerSideEncryption: 'AES256',
    })
    .promise();
}

function deleteObject(Key) {
  return s3
    .deleteObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key,
    })
    .promise();
}

async function deleteObjects(Prefix) {
  const data = await s3
    .listObjectsV2({
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix,
    })
    .promise();
  await s3
    .deleteObjects({
      Bucket: process.env.AWS_S3_BUCKET,
      Delete: {
        Objects: data.Contents.map((obj) => ({ Key: obj.Key })),
      },
    })
    .promise();
}

async function getObject(Key) {
  const data = await s3
    .getObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key,
    })
    .promise();
  const filePath = path.resolve(__dirname, '../tmp/downloads', Key);
  const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
  fs.ensureDirSync(dirPath);
  fs.writeFileSync(filePath, data.Body);
  return filePath;
}

function getSignedAssetUrl(Key, Expires = 60) {
  if (cf) {
    const url = `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${Key}`;
    const expires = Math.ceil(Date.now() / 1000) + Expires;
    return cf.getSignedUrl({ url, expires });
  }
  return s3.getSignedUrlPromise('getObject', {
    Bucket: process.env.AWS_S3_BUCKET,
    Expires,
    Key,
  });
}

function getSignedUploadUrl(ContentType, Key) {
  return s3.getSignedUrlPromise('putObject', {
    ACL: 'private',
    Bucket: process.env.AWS_S3_BUCKET,
    ContentType,
    Key,
    ServerSideEncryption: 'AES256',
  });
}

async function objectExists(Key) {
  try {
    const data = await s3
      .headObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key,
      })
      .promise();
    return data !== null;
  } catch {
    return false;
  }
}

function putObject(Key, filePath) {
  return s3
    .putObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key,
      Body: fs.createReadStream(filePath),
    })
    .promise();
}

module.exports = {
  copyObject,
  deleteObject,
  deleteObjects,
  getObject,
  getSignedAssetUrl,
  getSignedUploadUrl,
  objectExists,
  putObject,
};
