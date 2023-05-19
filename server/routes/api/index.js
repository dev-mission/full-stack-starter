const express = require('express');

const router = express.Router();

router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/invites', require('./invites'));
router.use('/passwords', require('./passwords'));
router.use('/teams', require('./teams'));
router.use('/users', require('./users'));

module.exports = router;
