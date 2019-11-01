'use strict';

const express = require('express');
const router = express.Router();
const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

router.get('/', interceptors.requireAdmin, function(req, res, next) {
  models.User.paginate({
    page: req.query.page || 1,
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['email', 'ASC']]
  }).then(function({docs, pages, total}) {
    res.json(docs.map(d => d.toJSON()));
  });
});

router.get('/me', interceptors.requireAdmin, function(req, res, next) {
  res.json(req.user.toJSON());
});

router.get('/:id', interceptors.requireAdmin, function(req, res, next) {
  models.User.findByPk(req.params.id).then(function(user) {
    if (user) {
      res.json(user.toJSON());
    } else {
      res.sendStatus(404);
    }
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

router.patch('/:id', interceptors.requireAdmin, function(req, res, next) {
  models.sequelize.transaction(function(transaction) {
    return models.User.findByPk(req.params.id, {transaction}).then(function(user) {
      return helpers.handleUpload(user, "iconUrl", req.body.iconUrl, 'users/icon');
    }).then(function(user) {
      return user.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        iconUrl: user.iconUrl
      }, {transaction});
    }).then(function(user) {
      if (req.body.password && req.body.password != '') {
        //// TODO: validate password requirements
        return user.hashPassword(req.body.password, {transaction}).then(function() {
          return user;
        });
      } else {
        return user;
      }
    });
  }).then(function(user){
    res.json(user.toJSON());
  }).catch(function(error) {
    console.log(error);
    if (error.name == 'SequelizeValidationError') {
      res.status(422).json({
        status: 422,
        messages: error.errors
      });
    } else {
      res.sendStatus(500);
    }
  });
});

module.exports = router;
