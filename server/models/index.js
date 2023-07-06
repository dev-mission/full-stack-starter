import fs from 'fs-extra';
import inflection from 'inflection';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';

import s3 from '../lib/s3.js';
import configs from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const config = configs[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
await Promise.all(
  fs
    .readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js')
    .map((file) =>
      import(path.join(__dirname, file))
        .then(({ default: init }) => init(sequelize, Sequelize.DataTypes))
        .then((model) => (db[model.name] = model))
    )
).then(() => {
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// add some helpers to the Sequelize Model class for handling file attachments

Sequelize.Model.prototype.assetUrl = function assetUrl(attribute) {
  const pathPrefix = `${inflection.tableize(this.constructor.name)}/${this.id}/${attribute}`;
  const file = this.get(attribute);
  if (file) {
    return path.resolve('/api/assets/', pathPrefix, file);
  }
  return null;
};

Sequelize.Model.prototype.getAssetFile = async function getAssetFile(attribute) {
  const assetPrefix = process.env.ASSET_PATH_PREFIX || '';
  const pathPrefix = `${inflection.tableize(this.constructor.name)}/${this.id}/${attribute}`;
  let filePath = this.get(attribute);
  if (!filePath) {
    return null;
  }
  if (process.env.AWS_S3_BUCKET) {
    filePath = path.join(assetPrefix, pathPrefix, filePath);
    filePath = await s3.getObject(filePath);
  } else {
    filePath = path.resolve(__dirname, '../public/assets', assetPrefix, pathPrefix, filePath);
  }
  return filePath;
};

Sequelize.Model.prototype.handleAssetFile = async function handleAssetFile(attribute, options, callback) {
  const pathPrefix = `${inflection.tableize(this.constructor.name)}/${this.id}/${attribute}`;
  if (!this.changed(attribute)) {
    return;
  }
  const assetPrefix = process.env.ASSET_PATH_PREFIX || '';
  const prevFile = this.previous(attribute);
  const newFile = this.get(attribute);
  const handle = async () => {
    let prevPath;
    let newPath;
    if (process.env.AWS_S3_BUCKET) {
      if (prevFile) {
        prevPath = path.join(assetPrefix, pathPrefix, prevFile);
        await s3.deleteObject(prevPath);
      }
      if (newFile) {
        newPath = path.join(assetPrefix, pathPrefix, newFile);
        await s3.copyObject(path.join(process.env.AWS_S3_BUCKET, 'uploads', newFile), newPath);
        await s3.deleteObject(path.join('uploads', newFile));
      }
    } else {
      if (prevFile) {
        prevPath = path.resolve(__dirname, '../public/assets', assetPrefix, pathPrefix, prevFile);
        fs.removeSync(prevPath);
      }
      if (newFile) {
        fs.ensureDirSync(path.resolve(__dirname, '../public/assets'));
        newPath = path.resolve(__dirname, '../public/assets', assetPrefix, pathPrefix, newFile);
        fs.moveSync(path.resolve(__dirname, '../tmp/uploads', newFile), newPath, {
          overwrite: true,
        });
      }
    }
    if (callback) {
      await callback(this.id, prevPath, newPath);
    }
  };
  if (options.transaction) {
    options.transaction.afterCommit(() => handle());
  } else {
    await handle();
  }
};

Sequelize.Model.paginate = async function paginate(options) {
  const newOptions = { ...options };
  const page = parseInt(newOptions.page || '1', 10);
  delete newOptions.page;
  const perPage = newOptions.paginate || 25;
  delete newOptions.paginate;
  newOptions.offset = (page - 1) * perPage;
  newOptions.limit = perPage;
  const { count, rows } = await this.findAndCountAll(newOptions);
  return { records: rows, pages: Math.ceil(count / perPage), total: count };
};

export default db;
