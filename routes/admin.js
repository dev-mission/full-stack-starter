const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET admin SPA index file */
router.get('/*', function(req, res, next) {
  const webpackStats = JSON.parse(fs.readFileSync('./client/webpack-stats.json'));
  res.render('admin', {
    title: 'Admin',
    webpackStats: webpackStats
  });
});

module.exports = router;
