/* eslint-disable mocha/no-top-level-hooks, mocha/no-hooks-for-single-case, mocha/no-exports */

// MUST BE FIRST! set the NODE_ENV to test to disable logging, switch to test db
process.env.NODE_ENV = 'test';
process.env.ASSET_PATH_PREFIX = 'test';
process.env.REACT_APP_FEATURE_REGISTRATION = 'true';

const fixtures = require('sequelize-fixtures');
const path = require('path');
const nodemailerMock = require('nodemailer-mock');

const models = require('../models');

const loadFixtures = async (files) => {
  const filePaths = files.map((f) => path.resolve(__dirname, `fixtures/${f}.json`));
  await models.sequelize.transaction(async (transaction) => {
    await fixtures.loadFiles(filePaths, models, { transaction });
  });
};

const resetDatabase = async () => {
  // clear all test data (order matters due to foreign key relationships)
  await models.sequelize.query(`
    DELETE FROM "SectionItems";
    DELETE FROM "Sections";
    DELETE FROM "Users";
  `);
};

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
  loadFixtures,
};
