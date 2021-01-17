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

module.exports = router;
