'use strict';

const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const interceptors = require('../interceptors');
const models = require('../../models');

const router = express.Router();

router.post('/login', function (req, res, next) {
  interceptors.passport.authenticate('local', function (err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.logIn(user, function (err) {
        if (err) {
          next(err);
        } else {
          res.status(HttpStatus.OK).json(user);
        }
      });
    } else {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
    }
  })(req, res, next);
});

/// handle logging out the current user
router.get('/logout', function (req, res) {
  req.logout();
  res.status(HttpStatus.NO_CONTENT).end();
});

/// register a new user if enabled
if (process.env.REACT_APP_FEATURE_REGISTRATION === 'true') {
  router.post('/register', async function (req, res, next) {
    const user = models.User.build(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
    try {
      await user.save();
      await user.sendWelcomeEmail();
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.status(HttpStatus.CREATED).json(user);
      });
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: error.errors || [],
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      }
    }
  });
}

module.exports = router;
