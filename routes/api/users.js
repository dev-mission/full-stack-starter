'use strict';

const express = require('express');
const router = express.Router();
const models = require('../../models');
const interceptors = require('../interceptors');

router.get('/', interceptors.requireAdmin, function(req, res, next) {
  models.User.paginate({
    page: req.query.page || 1,
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['email', 'ASC']]
  }).then(function({docs, pages, total}) {
    res.json(docs.map(d => d.toJSON()));
  });
});

router.get('/me', function(req, res, next) {
  res.json(req.user.toJSON());
});

module.exports = router;
