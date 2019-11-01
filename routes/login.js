'use strict'

const express = require('express');
const router = express.Router();
const models = require('../models');
const interceptors = require('./interceptors');


/* GET the forgot password form */
router.get('/forgot-password', function(req, res, next) {
  res.render('login/forgot-password');
});

/* POST email to forgot password for reset */
router.post('/forgot-password', function(req, res, next) {
  models.User.findOne({where: {email: req.body.email}}).then(function(user) {
    if (user) {
      user.sendPasswordResetEmail().then(function() {
        req.flash('info', 'Please check your email in a few moments for a password reset link.');
        res.redirect('/login');
      })
    } else {
      req.flash('error', 'The email you entered is not registered.');
      res.redirect('/login/forgot-password');
    }
  });
});

/* GET the reset password form */
router.get('/reset-password/:token', function(req, res, next) {
  models.User.findOne({where: {passwordResetToken: req.params.token}}).then(function(user) {
    if (user) {
      res.render('login/reset-password', {
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
router.post('/reset-password/:token', function(req, res, next) {
  models.User.findOne({where: {passwordResetToken: req.params.token}}).then(function(user) {
    if (user) {
      user.hashPassword(req.body.password).then(function() {
        req.flash('info', 'Your new password has been saved!');
        res.redirect('/login');
      });
    } else {
      req.flash('error', 'The password reset link you entered is invalid.');
      res.redirect('/login');
    }
  });
});

/* GET the login form */
router.get('/', function(req, res, next) {
  res.render('login/new', {
    redirectURI: req.query.redirectURI
  });
});

/* POST to submit login and password */
router.post('/', function(req, res, next) {
  interceptors.passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      let redirectURI = '/login';
      if (req.body.redirectURI != '') {
        redirectURI = `${redirectURI}?redirectURI=${encodeURIComponent(req.body.redirectURI)}`;
      }
      req.flash('error', 'The email and/or password was incorrect.');
      return res.redirect(redirectURI);
    }
    req.logIn(user, function(err) {
      if (req.body.redirectURI != '') {
        res.redirect(req.body.redirectURI);
      } else {
        res.redirect('/');
      }
    });
  })(req, res, next);
});

module.exports = router;
