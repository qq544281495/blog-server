const express = require('express');
const router = new express.Router();
const articleController = require('../controller/articleController');
const {verifyToken} = require('../util/jwt'); // 用户身份验证
const multer = require('multer');

// 上传文章
router.post(
  '/uploadArticle',
  verifyToken(),
  multer({dest: 'public/articleImage/'}).single('cover'),
  articleController.uploadArticle
);
// 查询文章
router.post('/search', articleController.search);
// 获取文章详情
router.post('/detail', articleController.detail);
// 更新文章
router.put(
  '/update',
  verifyToken(),
  multer({dest: 'public/articleImage/'}).single('cover'),
  articleController.update
);
// 删除文章
router.delete('/delete', verifyToken(), articleController.delete);

module.exports = router;
