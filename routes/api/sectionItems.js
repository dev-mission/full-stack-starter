'use strict';

const express = require('express');
const HttpStatus = require('http-status-codes');

const interceptors = require('../interceptors');
const models = require('../../models');

const router = express.Router();

router.get('/', async function(req, res) {
  const where = {};
  if (req.query.section) {
    where['$Section.slug$'] = req.query.section;
  }
  const items = await models.SectionItem.findAll({
    include: models.Section,
    order: [['endedAt', 'DESC']],
    where
  });
  res.json(items);
});

router.post('/', interceptors.requireLogin, async function(req, res) {
  req.body.endedAt = req.body.endedAt || null;
  const sectionItem = models.SectionItem.build(req.body);
  try {
    await sectionItem.save();
    res.status(HttpStatus.CREATED).json(sectionItem);
  } catch (error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
  }
});

router.get('/:id', interceptors.requireLogin, async function(req, res) {
  const sectionItem = await models.SectionItem.findByPk(req.params.id);
  if (sectionItem) {
    res.json(sectionItem);
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.patch('/:id', interceptors.requireLogin, async function(req, res) {
  req.body.endedAt = req.body.endedAt || null;
  const sectionItem = await models.SectionItem.findByPk(req.params.id);
  if (sectionItem) {
    try {
      await sectionItem.update(req.body);
      res.status(HttpStatus.OK).end();
    } catch (error) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    }
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.delete('/:id', interceptors.requireLogin, async function(req, res) {
  const sectionItem = await models.SectionItem.findByPk(req.params.id);
  if (sectionItem) {
    await sectionItem.destroy();
    res.status(HttpStatus.OK).end();
} else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

module.exports = router;
