var express = require('express');
var router = express.Router();
var models = require('../models');
var interceptors = require('./interceptors');

/* GET the login Form. */
router.get('/', function(req, res, next) {
  res.render('login/new', {
    title: 'Log in',
    redirectURI: req.query.redirectURI
  });
});

  /* Post to create a new report. */
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
