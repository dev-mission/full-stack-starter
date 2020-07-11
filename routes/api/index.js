const express = require('express');
const router = express.Router();

const interceptors = require('../interceptors');

const uploadsRouter = require('./uploads');
const usersRouter = require('./users');

router.use(interceptors.requireLogin);
router.use('/uploads', uploadsRouter);
router.use('/users', usersRouter);

module.exports = router;
