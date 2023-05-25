const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const helpers = require('../helpers');
const models = require('../../models');
const interceptors = require('../interceptors');

const router = express.Router();

router.get('/', interceptors.requireLogin, async (req, res) => {
  const { page = '1', TeamId } = req.query;
  const team = await models.Team.findByPk(TeamId);
  const membership = await team.getMembership(req.user);
  if (!membership) {
    res.status(StatusCodes.UNAUTHORIZED).end();
    return;
  }
  const options = {
    page,
    order: [['name', 'ASC']],
    where: { TeamId },
  };
  const { records, pages, total } = await models.Tour.paginate(options);
  helpers.setPaginationHeaders(req, res, options.page, pages, total);
  res.json(records.map((record) => record.toJSON()));
});

router.post('/', interceptors.requireLogin, async (req, res) => {
  const { TeamId } = req.body;
  const team = await models.Team.findByPk(TeamId);
  const membership = await team.getMembership(req.user);
  if (!membership) {
    res.status(StatusCodes.UNAUTHORIZED).end();
    return;
  }
  const record = models.Tour.build(_.pick(req.body, ['TeamId', 'link', 'names', 'descriptions', 'variants', 'visibility']));
  try {
    await record.save();
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
});

router.get('/:id/resources', interceptors.requireLogin, async (req, res) => {
  const record = await models.Tour.findByPk(req.params.id, {
    include: ['Team', { model: models.TourResource, include: { model: models.Resource, include: 'Files' } }],
  });
  if (record) {
    const membership = await record.Team.getMembership(req.user);
    if (!membership) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      // sort resources by start and name
      record.TourResources.sort((r1, r2) => {
        let result = r1.start.localeCompare(r2.start);
        if (result === 0) {
          result = r1.Resource.name.localeCompare(r2.Resource.name);
        }
        return result;
      });
      res.json(record.TourResources.map((tr) => tr.toJSON()));
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

router.post('/:id/resources', interceptors.requireLogin, async (req, res) => {
  const record = await models.Tour.findByPk(req.params.id, {
    include: ['Team'],
  });
  const resource = await models.Resource.findOne({
    where: {
      id: req.body.ResourceId,
      TeamId: record?.TeamId,
    },
  });
  if (record && resource) {
    const membership = await record.Team.getMembership(req.user);
    if (!membership) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      try {
        const newRecord = await models.TourResource.create({
          TourId: req.params.id,
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

router.patch('/:id/resources/:TourResourceId', interceptors.requireLogin, async (req, res) => {
  let record;
  let updatedRecord;
  let membership;
  try {
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Tour.findByPk(req.params.id, {
        include: ['Team'],
        transaction,
      });
      updatedRecord = await models.TourResource.findOne({
        where: {
          id: req.params.TourResourceId,
          TourId: req.params.id,
        },
        transaction,
      });
      if (record && updatedRecord) {
        membership = await record.Team.getMembership(req.user);
        if (membership) {
          await updatedRecord.update(_.pick(req.body, ['start', 'end']));
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

router.delete('/:id/resources/:TourResourceId', interceptors.requireLogin, async (req, res) => {
  let record;
  let updatedRecord;
  let membership;
  try {
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Tour.findByPk(req.params.id, {
        include: ['Team'],
        transaction,
      });
      updatedRecord = await models.TourResource.findOne({
        where: {
          id: req.params.TourResourceId,
          TourId: req.params.id,
        },
        transaction,
      });
      if (record && updatedRecord) {
        membership = await record.Team.getMembership(req.user);
        if (membership) {
          await updatedRecord.destroy();
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

router.get('/:id', interceptors.requireLogin, async (req, res) => {
  const record = await models.Tour.findByPk(req.params.id, {
    include: ['Team'],
  });
  if (record) {
    const membership = await record.Team.getMembership(req.user);
    if (!membership) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      res.json(record.toJSON());
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

router.patch('/:id', interceptors.requireLogin, async (req, res) => {
  const record = await models.Tour.findByPk(req.params.id, { include: 'Team' });
  if (record) {
    const membership = await record.Team.getMembership(req.user);
    if (!membership) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      try {
        await record.update(_.pick(req.body, ['link', 'names', 'descriptions', 'variants', 'visibility']));
        res.json(record.toJSON());
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

module.exports = router;
