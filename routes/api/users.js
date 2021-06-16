'use strict';

const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

router.get('/', interceptors.requireAdmin, async function(req, res) {
  const page = req.query.page || 1;
  const {docs, pages, total} = await models.User.paginate({
    page,
    order: [['lastName', 'ASC'], ['firstName', 'ASC'], ['email', 'ASC']]
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(docs.map(d => d.toJSON()));
});

router.get('/me', function(req, res, next) {
  if (req.user) {
    res.json(req.user.toJSON());
  } else {
    res.status(HttpStatus.NO_CONTENT).end();
  }
});

router.get('/:id', interceptors.requireAdmin, async function(req, res) {
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

router.patch('/:id', interceptors.requireLogin, function(req, res) {
  if (!req.user.isAdmin && req.user.id !== parseInt(req.params.id)) {
    res.status(HttpStatus.UNAUTHORIZED).end();
    return;
  }
  models.sequelize.transaction(async function(transaction) {
    try {
      const user = await models.User.findByPk(req.params.id, {transaction})
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).end();
        return;
      }
      if (req.body.password && req.body.password != '') {
        //// TODO: validate password requirements
        await user.hashPassword(req.body.password, {transaction});
      }
      helpers.handleUpload(user, "iconUrl", req.body.iconUrl, 'users/icon');
      await user.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        iconUrl: user.iconUrl
      }, {transaction});
      res.json(user.toJSON());
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          messages: error.errors
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      }  
    }
  });
});

module.exports = router;
