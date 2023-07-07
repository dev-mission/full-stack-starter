import express from 'express';
import { StatusCodes } from 'http-status-codes';

import models from '../../models/index.js';

const router = express.Router();

/* POST email to forgot password for reset */
router.post('/', async (req, res) => {
  const user = await models.User.findOne({ where: { email: req.body.email } });
  if (user) {
    await user.sendPasswordResetEmail();
    res.status(StatusCodes.OK).end();
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

/* GET to check the reset password token */
router.get('/:token', async (req, res) => {
  const user = await models.User.findOne({ where: { passwordResetToken: req.params.token } });
  if (user) {
    if (user.passwordResetTokenExpiresAt.getTime() < Date.now()) {
      res.status(StatusCodes.GONE).end();
    } else {
      res.status(StatusCodes.OK).end();
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

/* PATCH the new password */
router.patch('/:token', async (req, res) => {
  const user = await models.User.findOne({ where: { passwordResetToken: req.params.token } });
  if (user) {
    if (models.User.isValidPassword(req.body.password)) {
      await user.hashPassword(req.body.password);
      res.status(StatusCodes.OK).end();
    } else {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

export default router;
