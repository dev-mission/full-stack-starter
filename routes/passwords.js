'use strict'

const express = require('express');
const router = express.Router();
const models = require('../models');
const helpers = require('./helpers');

/* GET the forgot password form */
router.get('/forgot', function(req, res, next) {
  res.render('passwords/forgot');
});

/* POST email to forgot password for reset */
router.post('/forgot', function(req, res, next) {
  models.User.findOne({where: {email: req.body.email}}).then(function(user) {
    if (user) {
      user.sendPasswordResetEmail().then(function() {
        req.flash('info', 'Please check your email in a few moments for a password reset link.');
        res.redirect('/login');
      })
    } else {
      req.flash('error', 'The email you entered is not registered.');
      res.redirect('/passwords/forgot');
    }
  }).catch(console.log);
});

/* GET the reset password form */
router.get('/reset/:token', function(req, res, next) {
  models.User.findOne({where: {passwordResetToken: req.params.token}}).then(function(user) {
    if (user) {
      res.render('passwords/reset', {
        token: req.params.token,
        isExpired: user.passwordResetTokenExpiresAt.getTime() < Date.now()
      });
    } else {
      req.flash('error', 'The password reset link you entered is invalid.');
      res.redirect('/login');
    }
  });
});

/* POST the new password */
router.post('/reset/:token', function(req, res, next) {
  models.User.findOne({where: {passwordResetToken: req.params.token}}).then(function(user) {
    if (user) {
      console.log(req.body.password, models.User.isValidPassword(req.body.password));
      if (models.User.isValidPassword(req.body.password)) {
        user.hashPassword(req.body.password).then(function() {
          req.flash('info', 'Your new password has been saved!');
          res.redirect('/login');
        });
      } else {
        helpers.register(res, [{path: 'password', message: 'Minimum eight characters, at least one letter and one number.'}]);
        res.render('passwords/reset', {
          token: req.params.token,
          isExpired: user.passwordResetTokenExpiresAt.getTime() < Date.now()
        });
      }
    } else {
      req.flash('error', 'The password reset link you entered is invalid.');
      res.redirect('/login');
    }
  });
});

module.exports = router;
