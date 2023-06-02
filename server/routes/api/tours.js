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
    include: [{ model: models.Resource, as: 'CoverResource', include: 'Files' }],
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
  if (!membership || !membership.isEditor) {
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

router.use('/:TourId/stops', require('./tourStops'));

router.get('/:id', interceptors.requireLogin, async (req, res) => {
  const record = await models.Tour.findByPk(req.params.id, {
    include: [
      'Team',
      { model: models.Resource, as: 'CoverResource', include: 'Files' },
      {
        model: models.Stop,
        as: 'IntroStop',
        include: { model: models.StopResource, as: 'Resources', include: { model: models.Resource, include: 'Files' } },
      },
    ],
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
    if (!membership || !membership.isEditor) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      try {
        if (req.body.CoverResourceId) {
          const resource = await models.Resource.findOne({
            where: {
              id: req.body.CoverResourceId,
              TeamId: membership.TeamId,
            },
          });
          if (!resource) {
            res.status(StatusCodes.NOT_FOUND).end();
            return;
          }
        }
        if (req.body.IntroStopId) {
          const stop = await models.Stop.findOne({
            where: {
              id: req.body.IntroStopId,
              TeamId: membership.TeamId,
            },
          });
          if (!stop) {
            res.status(StatusCodes.NOT_FOUND).end();
            return;
          }
        }
        await record.update(
          _.pick(req.body, ['link', 'names', 'descriptions', 'variants', 'visibility', 'CoverResourceId', 'IntroStopId'])
        );
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
