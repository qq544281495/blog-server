const express = require('express');
const router = new express.Router();
const articleCommentController = require('../controller/articleCommentController');

// 发表评论
router.post('/publish', articleCommentController.publish);
router.post('/search', articleCommentController.search);
router.delete('/delete', articleCommentController.delete);
router.put('/update', articleCommentController.update);

module.exports = router;
