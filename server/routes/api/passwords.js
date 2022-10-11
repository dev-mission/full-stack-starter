const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

/* POST email to forgot password for reset */
router.post('/', async (req, res) => {
  const user = await models.User.findOne({ where: { email: req.body.email } });
  if (user) {
    await user.sendPasswordResetEmail();
    res.status(HttpStatus.OK).end();
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

/* GET to check the reset password token */
router.get('/:token', async (req, res) => {
  const user = await models.User.findOne({ where: { passwordResetToken: req.params.token } });
  if (user) {
    if (user.passwordResetTokenExpiresAt.getTime() < Date.now()) {
      res.status(HttpStatus.GONE).end();
    } else {
      res.status(HttpStatus.OK).end();
    }
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

/* PATCH the new password */
router.patch('/:token', async (req, res) => {
  const user = await models.User.findOne({ where: { passwordResetToken: req.params.token } });
  if (user) {
    if (models.User.isValidPassword(req.body.password)) {
      await user.hashPassword(req.body.password);
      res.status(HttpStatus.OK).end();
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
    }
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

module.exports = router;
