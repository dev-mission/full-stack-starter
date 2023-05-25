const express = require('express');
const path = require('path');

const router = express.Router();

// configure serving up a built client app assets
router.use(express.static(path.join(__dirname, '../../client/build'), { index: false }));

// configure serving any static file in public folder
router.use(express.static(path.join(__dirname, '../public')));

// serve some paths from other nested routers
router.use('/api', require('./api'));

// serve up the client app for all other routes, per SPA client-side routing
router.get('/*', require('./react'));

module.exports = router;
