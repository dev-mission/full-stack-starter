const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const helpers = require('../helpers');
const models = require('../../models');
const interceptors = require('../interceptors');

const router = express.Router();

router.get('/', interceptors.requireLogin, async (req, res) => {
  const options = {
    page: req.query.page || '1',
    order: [['name', 'ASC']],
  };
  const { records, pages, total } = await models.Team.paginate(options);
  helpers.setPaginationHeaders(req, res, options.page, pages, total);
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
  const record = await models.Team.findByPk(req.params.id);
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

module.exports = router;
