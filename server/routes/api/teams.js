const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');

const router = express.Router();

router.get('/', interceptors.requireLogin, async (req, res) => {
  const records = await req.user.getTeams();
  res.json(records.map((record) => record.toJSON()));
});

router.post('/', interceptors.requireLogin, async (req, res) => {
  let record = models.Team.build(_.pick(req.body, ['name', 'link', 'variants']));
  try {
    await models.sequelize.transaction(async (transaction) => {
      await record.save({ transaction });
      const membership = await models.Membership.create(
        {
          TeamId: record.id,
          UserId: req.user.id,
          role: 'OWNER',
        },
        { transaction }
      );
      record.Memberships = [membership];
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors.map((e) => _.pick(e, ['path', 'message', 'value'])),
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
    record = null;
  }
  if (record) {
    res.status(StatusCodes.CREATED).json(record.toJSON());
  }
});

router.get('/:id', interceptors.requireLogin, async (req, res) => {
  let record;
  let membership;
  await models.sequelize.transaction(async (transaction) => {
    record = await models.Team.findByPk(req.params.id, {
      include: { model: models.Membership, include: ['Invite', 'User'] },
      transaction,
    });
    membership = await record.getMembership(req.user, { transaction });
  });
  if (record) {
    if (membership) {
      res.json(record.toJSON());
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

router.patch('/:id', interceptors.requireLogin, async (req, res) => {
  let record;
  let membership;
  try {
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Team.findByPk(req.params.id, {
        include: { model: models.Membership, include: 'User' },
        transaction,
      });
      membership = await record.getMembership(req.user, { transaction });
      if (membership?.isOwner) {
        await record.update(_.pick(req.body, ['name', 'link']), { transaction });
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

module.exports = router;
