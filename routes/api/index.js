const express = require('express');
const router = express.Router();

const uploadsRouter = require('./uploads');
const usersRouter = require('./users');

router.use('/uploads', uploadsRouter);
router.use('/users', usersRouter);

module.exports = router;
