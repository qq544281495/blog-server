const express = require('express');
const router = new express.Router();
const imageController = require('../controller/imageController');
const {verifyToken} = require('../util/jwt'); // 用户身份验证
const multer = require('multer');

// 上传文章图片
router.post(
  '/uploadImage',
  verifyToken(),
  multer({dest: 'public/image/'}).single('image'),
  imageController.uploadImage
);
// 删除文章图片
router.delete('/deleteImage', verifyToken(), imageController.deleteImage);

module.exports = router;
