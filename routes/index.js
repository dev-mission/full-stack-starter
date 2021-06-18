const express = require('express');
const path = require('path');

const router = express.Router();

/// configure serving up a built client app
router.use(express.static(path.join(__dirname, '../client/build')));

/// configure serving any static file in public folder
router.use(express.static(path.join(__dirname, '../public')));

/// serve libraries installed as node modules
router.use('/libraries/bootstrap', express.static(path.join(__dirname, '../client/node_modules/bootstrap/dist')));

/// serve some paths from other nested routers
router.use('/api', require('./api'));

/// serve up the client app for all other routes, per SPA client-side routing
router.get('/*', (req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  } else {
    next();
  }
});

module.exports = router;
