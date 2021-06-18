const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocal = require('passport-local');
const HttpStatus = require('http-status-codes');

const models = require('../models');

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
