'use strict';

const express = require('express');
const HttpStatus = require('http-status-codes');

const interceptors = require('../interceptors');
const models = require('../../models');

const router = express.Router();

router.get('/', async function(req, res) {
  const sections = await models.Section.findAll({
    order: [['position', 'ASC'], ['name', 'ASC']]
  });
  res.json(sections);
});

router.post('/', interceptors.requireLogin, async function(req, res) {
  const section = models.Section.build(req.body);
  try {
    await section.save();
    res.status(HttpStatus.CREATED).json(section);
  } catch (error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
  }
});

router.get('/:id', async function(req, res) {
  const section = await models.Section.findByPk(req.params.id);
  if (section) {
    res.json(section);
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.patch('/:id', interceptors.requireLogin, async function(req, res) {
  const section = await models.Section.findByPk(req.params.id);
  if (section) {
    try {
      await section.update(req.body);
      res.status(HttpStatus.OK).end();  
    } catch (error) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    }
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
})

router.delete('/:id', interceptors.requireLogin, async function(req, res) {
  const section = await models.Section.findByPk(req.params.id);
  if (section) {
    await section.destroy();
    res.status(HttpStatus.OK).end();
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

module.exports = router;
