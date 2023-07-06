/* eslint-disable mocha/no-top-level-hooks, mocha/no-hooks-for-single-case, mocha/no-exports */

import './vars.js';
// Load .env config after above overrides
import 'dotenv/config';
import fixtures from 'sequelize-fixtures';
import path from 'path';
import fs from 'fs-extra';
import nodemailerMock from 'nodemailer-mock';
import { fileURLToPath } from 'url';

import models from '../models/index.js';
import s3 from '../lib/s3.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

export default {
  assetPathExists,
  cleanAssets,
  loadFixtures,
  loadUploads,
  sleep,
};
