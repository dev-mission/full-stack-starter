const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');

const router = express.Router();

router.post('/', interceptors.requireLogin, async (req, res) => {
  const { TeamId, email, role } = req.body;
  const team = await models.Team.findByPk(TeamId);
  const membership = await team?.getMembership(req.user);
  if (membership?.isOwner) {
    try {
      const user = await models.User.findOne({ where: { email } });
      let record;
      if (user) {
        record = await models.Membership.create({ TeamId, UserId: user.id, role });
        record.User = user;
      } else {
        let invite;
        await models.sequelize.transaction(async (transaction) => {
          [invite] = await models.Invite.findOrCreate({
            where: { email, revokedAt: null },
            defaults: { CreatedByUserId: req.user.id },
            transaction,
          });
          record = await models.Membership.create({ TeamId, InviteId: invite.id, role }, { transaction });
          record.Invite = invite;
        });
        await invite.sendTeamInviteEmail(team);
      }
      res.status(StatusCodes.CREATED).json(record.toJSON());
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          status: StatusCodes.UNPROCESSABLE_ENTITY,
          errors: error.errors.map((e) => _.pick(e, ['path', 'message', 'value'])),
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).end();
  }
});

router.patch('/:id', interceptors.requireLogin, async (req, res) => {
  let record;
  let membership;
  try {
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Membership.findByPk(req.params.id, {
        include: ['Team', 'User'],
        transaction,
      });
      membership = await record.Team.getMembership(req.user, { transaction });
      if (membership?.isOwner) {
        await record.update(_.pick(req.body, ['role']), { transaction });
      }
    });
    if (record) {
      if (membership?.isOwner) {
        res.json(record.toJSON());
      } else {
        res.status(StatusCodes.UNAUTHORIZED).end();
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors.map((e) => _.pick(e, ['path', 'message', 'value'])),
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.delete('/:id', interceptors.requireLogin, async (req, res) => {
  let record;
  let membership;
  try {
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Membership.findByPk(req.params.id, {
        include: ['Team', 'Invite', 'User'],
        transaction,
      });
      membership = await record.Team.getMembership(req.user, { transaction });
      if (membership?.isOwner) {
        await record.destroy({ transaction });
        if (!record.User && (await record.Invite?.countMemberships({ transaction })) === 0) {
          await record.Invite.update({ revokedAt: new Date(), RevokedByUserId: req.user.id }, { transaction });
        }
      }
    });
    if (record) {
      if (membership?.isOwner) {
        res.status(StatusCodes.NO_CONTENT).end();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).end();
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors.map((e) => _.pick(e, ['path', 'message', 'value'])),
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
});

module.exports = router;
