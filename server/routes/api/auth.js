const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const interceptors = require('../interceptors');
const models = require('../../models');

const router = express.Router();

router.post('/login', (req, res, next) => {
  interceptors.passport.authenticate('local', (err, user) => {
    if (err) {
      next(err);
    } else if (user) {
      req.logIn(user, (logInErr) => {
        if (logInErr) {
          next(logInErr);
        } else {
          res.status(StatusCodes.OK).json(user);
        }
      });
    } else {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    }
  })(req, res, next);
});

/// handle logging out the current user
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.status(StatusCodes.NO_CONTENT).end();
  });
});

/// register a new user if enabled
if (process.env.REACT_APP_FEATURE_REGISTRATION === 'true') {
  router.post('/register', async (req, res, next) => {
    const user = models.User.build(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
    try {
      await user.save();
      user.Memberships = await user.getMemberships({
        include: 'Team',
        order: [['Team', 'name', 'ASC']],
      });
      await user.sendWelcomeEmail();
      req.login(user, (err) => {
        if (err) {
          next(err);
          return;
        }
        res.status(StatusCodes.CREATED).json(user);
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          status: StatusCodes.UNPROCESSABLE_ENTITY,
          errors: error.errors || [],
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
    }
  });
}

module.exports = router;
