const express = require('express');
const router = new express.Router();
const articleController = require('../controller/articleController');
const {verifyToken} = require('../util/jwt'); // 用户身份验证
const multer = require('multer');
const upload = multer({dest: 'public/articleImage/'});

// 上传文章图片
router.post(
  '/uploadImage',
  verifyToken(),
  upload.single('articleImage'),
  articleController.uploadImage
);
// 删除文章图片
router.delete('/deleteImage', verifyToken(), articleController.deleteImage);
// 上传文章
router.post(
  '/uploadArticle',
  verifyToken(),
  upload.single('coverImage'),
  articleController.uploadArticle
);

module.exports = router;
