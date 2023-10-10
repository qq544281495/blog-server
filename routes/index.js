const express = require('express');
const router = new express.Router();

router.use('/user', require('./user'));
router.use('/article', require('./article'));
router.use('/classify', require('./classify'));
router.use('/label', require('./label'));
router.use('/articleComment', require('./articleComment'));
router.use('/operateImage', require('./operateImage'));
router.use('/project', require('./project'));

module.exports = router;
