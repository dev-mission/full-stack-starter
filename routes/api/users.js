const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

router.get('/', interceptors.requireAdmin, async (req, res) => {
  const page = req.query.page || 1;
  const { records, pages, total } = await models.User.paginate({
    page,
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
      ['email', 'ASC'],
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user.toJSON());
  } else {
    res.status(HttpStatus.NO_CONTENT).end();
  }
});

router.get('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const user = await models.User.findByPk(req.params.id);
    if (user) {
      res.json(user.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', interceptors.requireLogin, (req, res) => {
  if (!req.user.isAdmin && req.user.id !== parseInt(req.params.id, 10)) {
    res.status(HttpStatus.UNAUTHORIZED).end();
    return;
  }
  models.sequelize.transaction(async (transaction) => {
    try {
      const user = await models.User.findByPk(req.params.id, { transaction });
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).end();
        return;
      }
      await user.update(_.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'picture']), { transaction });
      res.json(user.toJSON());
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: error.errors,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      }
    }
  });
});

module.exports = router;
