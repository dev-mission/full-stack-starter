'use strict'

const express = require('express');
const HttpStatus = require('http-status-codes');

const interceptors = require('../interceptors');
const models = require('../../models');

const router = express.Router();

router.post('/login', function(req, res, next) {
  interceptors.passport.authenticate('local', function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.logIn(user, function(err) {
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
router.get('/logout', function(req, res){
  req.logout();
  res.status(HttpStatus.NO_CONTENT).end();
});

/// register a new user if enabled
if (process.env.REACT_APP_FEATURE_REGISTRATION === 'true') {
  router.post('/register', async function(req, res, next) {
    const user = models.User.build({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
    user.password = req.body.password;
    const errors = [];
    if (!models.User.isValidPassword(user.password)) {
      errors.push({path: 'password', message: 'Minimum eight characters, at least one letter and one number.'});
    }
    const existingUser = await models.User.findOne({where: {email: req.body.email}});
    if (existingUser) {
      errors.push({path: 'email', message: 'This email has already been used.'});
    }
    try {
      await user.validate();
      if (errors.length > 0) {
        throw {errors: []};
      }
      await user.save();
      await user.hashPassword(user.password);
      await user.sendWelcomeEmail();
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.status(HttpStatus.CREATED).json(user);
      });
    } catch(error) {
      error.errors = errors.concat(error.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    };
  });  
}

module.exports = router;
