const express = require('express');
const router = new express.Router();
const labelController = require('../controller/labelController');
const {verifyToken} = require('../util/jwt'); // 用户身份验证

router.post('/create', verifyToken(), labelController.create);
router.post('/search', verifyToken(), labelController.search);
router.put('/update', verifyToken(), labelController.update);
router.delete('/delete', verifyToken(), labelController.delete);

module.exports = router;
