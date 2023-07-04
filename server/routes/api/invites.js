import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import helpers from '../helpers.js';
import models from '../../models/index.js';
import interceptors from '../interceptors.js';

const router = express.Router();

router.get('/', interceptors.requireAdmin, async (req, res) => {
  const options = {
    page: req.query.page || '1',
    order: [['createdAt', 'DESC']],
    where: {
      acceptedAt: null,
      revokedAt: null,
    },
  };
  const { records, pages, total } = await models.Invite.paginate(options);
  helpers.setPaginationHeaders(req, res, options.page, pages, total);
  res.json(records.map((record) => record.toJSON()));
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  const invite = models.Invite.build(_.pick(req.body, ['firstName', 'lastName', 'email', 'message']));
  invite.CreatedByUserId = req.user.id;
  try {
    await invite.save();
    await invite.sendInviteEmail();
    res.status(StatusCodes.CREATED).json(invite.toJSON());
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.post('/:id/resend', interceptors.requireAdmin, async (req, res) => {
  await models.sequelize.transaction(async (transaction) => {
    const invite = await models.Invite.findByPk(req.params.id, { transaction });
    if (invite) {
      invite.changed('updatedAt', true);
      await invite.update({ updatedAt: new Date() });
      await invite.sendInviteEmail();
      res.json(invite.toJSON());
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  });
});

router.delete('/:id', interceptors.requireAdmin, async (req, res) => {
  await models.sequelize.transaction(async (transaction) => {
    const invite = await models.Invite.findByPk(req.params.id, { transaction });
    if (invite) {
      if (invite.acceptedAt) {
        res.status(StatusCodes.FORBIDDEN).end();
      }
      await invite.update({ revokedAt: new Date(), RevokedByUserId: req.user.id });
      res.status(StatusCodes.OK).end();
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  });
});

router.post('/:id/accept', async (req, res, next) => {
  req.logout(async () => {
    try {
      let user;
      await models.sequelize.transaction(async (transaction) => {
        const invite = await models.Invite.findByPk(req.params.id, { transaction });
        if (invite) {
          if (invite.acceptedAt || invite.revokedAt) {
            res.status(StatusCodes.FORBIDDEN).end();
            return;
          }
          user = models.User.build(_.pick(req.body, ['firstName', 'lastName', 'username', 'email', 'password', 'confirmPassword']));
          await user.save({ transaction });
          await invite.update(
            {
              AcceptedByUserId: user.id,
              acceptedAt: new Date(),
            },
            { transaction }
          );
          await user.sendWelcomeEmail();
        }
      });
      if (user) {
        req.login(user, (err) => {
          if (err) {
            next(err);
            return;
          }
          res.status(StatusCodes.CREATED).json(user);
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
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
});

router.get('/:id', async (req, res) => {
  req.logout(async () => {
    const invite = await models.Invite.findByPk(req.params.id);
    if (invite) {
      res.json(invite.toJSON());
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  });
});

export default router;
