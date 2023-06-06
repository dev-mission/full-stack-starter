const express = require('express');

const router = express.Router();

router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/files', require('./files'));
router.use('/invites', require('./invites'));
router.use('/memberships', require('./memberships'));
router.use('/passwords', require('./passwords'));
router.use('/resources', require('./resources'));
router.use('/stops', require('./stops'));
router.use('/teams', require('./teams'));
router.use('/tours', require('./tours'));
router.use('/users', require('./users'));

module.exports = router;
