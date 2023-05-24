

const express = require('express');
const path = require('path');

const router = express.Router();

/// serve up the client app for all other routes, per SPA client-side routing
router.get('/*', (req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '../../../client/build', 'index.html'));
  } else {
    next();
  }
});

module.exports = router;
