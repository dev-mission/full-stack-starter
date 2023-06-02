const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');

const router = express.Router({ mergeParams: true });

router.get('/', interceptors.requireLogin, async (req, res) => {
  const { StopId } = req.params;
  const record = await models.Stop.findByPk(StopId, {
    include: ['Team', { model: models.StopResource, as: 'Resources', include: { model: models.Resource, include: 'Files' } }],
  });
  if (record) {
    const membership = await record.Team.getMembership(req.user);
    if (!membership) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      // sort resources by type, start and name
      record.Resources.sort((r1, r2) => {
        let result = r1.Resource.type.localeCompare(r2.Resource.type);
        if (result === 0) {
          result = Math.sign(r1.start - r2.start);
          if (result === 0) {
            result = r1.Resource.name.localeCompare(r2.Resource.name);
          }
        }
        return result;
      });
      res.json(record.Resources.map((tr) => tr.toJSON()));
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

router.post('/', interceptors.requireLogin, async (req, res) => {
  const { StopId } = req.params;
  const record = await models.Stop.findByPk(StopId, {
    include: ['Team'],
  });
  const resource = await models.Resource.findOne({
    include: 'Files',
    where: {
      id: req.body.ResourceId,
      TeamId: record?.TeamId,
    },
  });
  if (record && resource) {
    const membership = await record.Team.getMembership(req.user);
    if (!membership || !membership.isEditor) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      try {
        const newRecord = await models.StopResource.create({
          StopId,
          ..._.pick(req.body, ['ResourceId', 'start', 'end']),
        });
        newRecord.Resource = resource;
        res.status(StatusCodes.CREATED).json(newRecord.toJSON());
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
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

router.patch('/:id', interceptors.requireLogin, async (req, res) => {
  const { id, StopId } = req.params;
  let record;
  let updatedRecord;
  let membership;
  try {
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Stop.findByPk(StopId, {
        include: ['Team'],
        transaction,
      });
      updatedRecord = await models.StopResource.findOne({
        include: { model: models.Resource, include: 'Files' },
        where: { id, StopId },
        transaction,
      });
      if (record && updatedRecord) {
        membership = await record.Team.getMembership(req.user, { transaction });
        if (membership && membership.isEditor) {
          await updatedRecord.update(_.pick(req.body, ['start', 'end']));
        } else {
          membership = null;
        }
      }
    });
    if (record && updatedRecord) {
      if (!membership) {
        res.status(StatusCodes.UNAUTHORIZED).end();
      } else {
        res.json(updatedRecord.toJSON());
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
  const { id, StopId } = req.params;
  let record;
  let updatedRecord;
  let membership;
  try {
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Stop.findByPk(StopId, {
        include: ['Team'],
        transaction,
      });
      updatedRecord = await models.StopResource.findOne({
        where: { id, StopId },
        transaction,
      });
      if (record && updatedRecord) {
        membership = await record.Team.getMembership(req.user, { transaction });
        if (membership && membership.isEditor) {
          await updatedRecord.destroy();
        } else {
          membership = null;
        }
      }
    });
    if (record && updatedRecord) {
      if (!membership) {
        res.status(StatusCodes.UNAUTHORIZED).end();
      } else {
        res.status(StatusCodes.NO_CONTENT).end();
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
