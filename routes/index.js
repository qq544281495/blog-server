const express = require('express');
const router = new express.Router();

router.use('/user', require('./user'));
router.use('/article', require('./article'));
router.use('/classify', require('./classify'));

module.exports = router;
