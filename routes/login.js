'use strict'

const express = require('express');
const router = express.Router();
const models = require('../models');
const interceptors = require('./interceptors');

/* GET the login form */
router.get('/', function(req, res, next) {
  req.logout();
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
