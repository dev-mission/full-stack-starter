'use strict';

const bcrypt = require('bcrypt')
const passport = require('passport');
const passportLocal = require('passport-local');
const models = require('../models');

passport.use(
  new passportLocal.Strategy({
    usernameField: 'email',
  },
  function(email, password, done) {
    models.User.findOne({where: {email: email}}).then(function(user) {
      bcrypt.compare(password, user.hashedPassword).then(function(res) {
        if (res) {
          return done(null, user);
        }
        return done(null, false, { message: 'Invalid password' });
      }).catch(function(error) {
        return done(null, false, { message: 'Invalid password' });
      });
    }).catch(function(error) {
      return done(null, false, { message: 'Invalid login' });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findByPk(id).then(function(user) {
    done(null, user);
  });
});

module.exports.passport = passport;

function sendErrorUnauthorized(req, res) {
  if (req.accepts('html')) {
    req.flash("error", "You must log in to view the page you visited.");
    res.redirect(`/login?redirectURI=${encodeURIComponent(req.originalUrl)}`);
  } else {
    res.sendStatus(401);
  }
}

function sendErrorForbidden(req, res) {
  if (req.accepts('html')) {
    req.flash("error", "You are not allowed to view the page you visited.");
    res.redirect(`/`);
  } else {
    res.sendStatus(403);
  }
}

function requireLogin(req, res, next, requireAdmin) {
  if (req.user) {
    if (requireAdmin) {
      if (req.user.isAdmin) {
        next();
      } else {
        sendErrorForbidden(req, res);
      }
    } else {
      next();
    }
  } else {
    sendErrorUnauthorized(req, res);
  }
}

module.exports.requireLogin = function(req, res, next) {
  requireLogin(req, res, next, false);
}

module.exports.requireAdmin = function(req, res, next) {
  requireLogin(req, res, next, true);
}
