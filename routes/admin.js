const express = require('express');
const router = express.Router();
const fs = require('fs');

const interceptors = require('./interceptors');

/* GET admin SPA index file */
router.get('/*', interceptors.requireAdmin, function(req, res, next) {
  const webpackStats = JSON.parse(fs.readFileSync('./client/webpack-stats.json'));
  res.render('admin/index', {
    webpackStats: webpackStats,
    layout: 'admin/layout'
  });
});

module.exports = router;
