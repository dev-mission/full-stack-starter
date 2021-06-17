const express = require('express');

const router = express.Router();

router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/passwords', require('./passwords'));
router.use('/sections', require('./sections'));
router.use('/sectionItems', require('./sectionItems'));
router.use('/users', require('./users'));

module.exports = router;
