'use strict'

const express = require('express');
const router = express.Router();
const models = require('../models');
const helpers = require('./helpers');
const interceptors = require('./interceptors');

/* GET the register form */
router.get('/', function(req, res, next) {
  req.logout();
  const user = models.User.build({});
  helpers.register(res);
  res.render('registrations/new', {
    user: user,
    redirectURI: req.query.redirectURI
  });
});

/* POST to submit login and password */
router.post('/', function(req, res, next) {
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
  models.User.findOne({where: {email: {[models.Sequelize.Op.iLike]: req.body.email}}}).then(function(existingUser) {
    if (existingUser) {
      errors.push({path: 'email', message: 'This email has already been used.'});
    }
    return user.validate();
  }).then(function() {
    if (errors.length > 0) {
      return new Promise((resolve, reject) => reject({errors: []}));
    } else {
      return user.save();
    }
  }).then(function() {
    return user.hashPassword(user.password);
  }).then(function() {
    return user.sendWelcomeEmail();
  }).then(function() {
    req.flash('info', 'Your account has been created! Please log in.');
    if (req.body.redirectURI != '') {
      res.redirect(`/login?redirectURI=${req.body.redirectURI}`);
    } else {
      res.redirect('/login');
    }
  }).catch(function(error) {
    helpers.register(res, errors.concat(error.errors));
    res.render('registrations/new', {
      user: user,
      redirectURI: req.body.redirectURI,
    });
  });
});

module.exports = router;
