var express = require('express');
var router = express.Router();
var models = require('../models');
var interceptors = require('./interceptors');


/* GET the forgot password form */
router.get('/forgot-password', function(req, res, next) {
  res.render('login/forgot-password', {
    title: 'Forgot your password?'
  });
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
        title: 'Reset your password',
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
    title: 'Log in',
    redirectURI: req.query.redirectURI
  });
});

/* POST to submit login and password */
router.post('/', interceptors.passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res) {
  if (req.body.redirectURI != '') {
    res.redirect(req.body.redirectURI);
  } else {
    res.redirect('/');
  }
});

module.exports = router;
