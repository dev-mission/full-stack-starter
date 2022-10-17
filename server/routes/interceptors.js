const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocal = require('passport-local');
const HttpStatus = require('http-status-codes');

const models = require('../models');

/* eslint-disable no-param-reassign, no-underscore-dangle */
function SessionManager(options, serializeUser) {
  if (typeof options === 'function') {
    serializeUser = options;
    options = undefined;
  }
  options = options || {};
  this._key = options.key || 'passport';
  this._serializeUser = serializeUser;
}

SessionManager.prototype.logIn = function logIn(req, user, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  const self = this;
  this._serializeUser(user, req, (err, obj) => {
    if (err) {
      cb(err);
      return;
    }
    if (!req.session) {
      req.session = {};
    }
    if (!req.session[self._key]) {
      req.session[self._key] = {};
    }
    req.session[self._key].user = obj;
    cb();
  });
};

SessionManager.prototype.logOut = function logOut(req, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  if (req.session && req.session[this._key]) {
    delete req.session[this._key].user;
  }
  if (cb) {
    cb();
  }
};
/* eslint-enable no-param-reassign */

passport._sm = new SessionManager(passport.serializeUser.bind(passport));

passport.use(
  new passportLocal.Strategy(
    {
      usernameField: 'email',
    },
    (email, password, done) => {
      models.User.findOne({ where: { email } })
        .then((user) => {
          bcrypt
            .compare(password, user.hashedPassword)
            .then((res) => {
              if (res) {
                return done(null, user);
              }
              return done(null, false, { message: 'Invalid password' });
            })
            .catch(() => done(null, false, { message: 'Invalid password' }));
        })
        .catch(() => done(null, false, { message: 'Invalid login' }));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.User.findByPk(id).then((user) => {
    done(null, user);
  });
});

module.exports.passport = passport;

function sendErrorUnauthorized(req, res) {
  res.sendStatus(HttpStatus.UNAUTHORIZED);
}

function sendErrorForbidden(req, res) {
  res.sendStatus(HttpStatus.FORBIDDEN);
}

function requireLoginInternal(req, res, next, requireAdmin) {
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

module.exports.requireLogin = function requireLogin(req, res, next) {
  requireLoginInternal(req, res, next, false);
};

module.exports.requireAdmin = function requireAdmin(req, res, next) {
  requireLoginInternal(req, res, next, true);
};
