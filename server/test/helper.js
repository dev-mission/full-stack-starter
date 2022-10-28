/* eslint-disable mocha/no-top-level-hooks, mocha/no-hooks-for-single-case, mocha/no-exports */

// MUST BE FIRST! set the NODE_ENV to test to disable logging, switch to test db
process.env.NODE_ENV = 'test';
process.env.ASSET_PATH_PREFIX = 'test';
process.env.REACT_APP_FEATURE_REGISTRATION = 'true';

const fixtures = require('sequelize-fixtures');
const path = require('path');
const fs = require('fs-extra');
const nodemailerMock = require('nodemailer-mock');

const models = require('../models');
const s3 = require('../lib/s3');

async function loadFixtures(files) {
  const filePaths = files.map((f) => path.resolve(__dirname, `fixtures/${f}.json`));
  await models.sequelize.transaction(async (transaction) => {
    await fixtures.loadFiles(filePaths, models, { transaction });
  });
}

async function loadUploads(uploads) {
  if (process.env.AWS_S3_BUCKET) {
    await Promise.all(
      uploads.map((upload) => s3.putObject(path.join('uploads', upload[1]), path.resolve(__dirname, `fixtures/files/${upload[0]}`)))
    );
  } else {
    fs.ensureDirSync(path.resolve(__dirname, '../tmp/uploads'));
    uploads.forEach((upload) => {
      fs.copySync(path.resolve(__dirname, `fixtures/files/${upload[0]}`), path.resolve(__dirname, `../tmp/uploads/${upload[1]}`));
    });
  }
}

function assetPathExists(assetPath) {
  if (process.env.AWS_S3_BUCKET) {
    return s3.objectExists(path.join(process.env.ASSET_PATH_PREFIX, assetPath));
  }
  return fs.pathExistsSync(path.resolve(__dirname, '../public/assets', process.env.ASSET_PATH_PREFIX, assetPath));
}

async function cleanAssets() {
  if (process.env.AWS_S3_BUCKET) {
    await s3.deleteObjects(process.env.ASSET_PATH_PREFIX);
  } else {
    fs.removeSync(path.resolve(__dirname, '../../../public/assets', process.env.ASSET_PATH_PREFIX));
  }
}

async function resetDatabase() {
  // clear all test data (order matters due to foreign key relationships)
  await models.sequelize.query(`
    DELETE FROM "Invites";
    DELETE FROM "Users";
  `);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

beforeEach(async () => {
  await resetDatabase();
  nodemailerMock.mock.reset();
});

// eslint-disable-next-line no-undef
after(async () => {
  // close all db connections
  await models.sequelize.close();
});

module.exports = {
  assetPathExists,
  cleanAssets,
  loadFixtures,
  loadUploads,
  sleep,
};
