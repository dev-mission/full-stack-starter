const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');
const { Op } = require('sequelize');

const helpers = require('../helpers');
const models = require('../../models');
const interceptors = require('../interceptors');

const router = express.Router();

router.get('/', interceptors.requireLogin, async (req, res) => {
  const { page = '1', TeamId, type, search } = req.query;
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
  if (type) {
    options.where.type = type;
  }
  if (search && search.trim() !== '') {
    options.where.name = {
      [Op.iLike]: `%${search.trim()}%`,
    };
  }
  const { records, pages, total } = await models.Resource.paginate(options);
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
  let record = models.Resource.build(_.pick(req.body, ['TeamId', 'name', 'type', 'variants']));
  try {
    await models.sequelize.transaction(async (transaction) => {
      await record.save({ transaction });
      if (req.body.Files) {
        const files = req.body.Files.map((f) =>
          models.File.create(
            {
              ..._.pick(f, ['variant', 'externalURL', 'key']),
              ResourceId: record.id,
            },
            { transaction }
          )
        );
        await Promise.all(files);
      }
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
  const record = await models.Resource.findByPk(req.params.id, { include: ['Team', 'Files'] });
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
  const record = await models.Resource.findByPk(req.params.id, { include: 'Team' });
  if (record) {
    const membership = await record.Team.getMembership(req.user);
    if (!membership) {
      res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      try {
        await record.update(_.pick(req.body, ['name', 'type', 'variants']));
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
