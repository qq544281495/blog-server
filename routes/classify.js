const express = require('express');
const router = new express.Router();
const classifyController = require('../controller/classifyController');
const {verifyToken} = require('../util/jwt'); // 用户身份验证
const multer = require('multer');
const upload = multer({dest: 'public/classifyImage/'});

// 创建分类
router.post(
  '/create',
  verifyToken(),
  upload.single('cover'),
  classifyController.create
);
// 获取分类
router.post('/search', classifyController.search);
// 删除分类
router.delete('/delete', verifyToken(), classifyController.delete);
// 编辑分类
router.put(
  '/update',
  verifyToken(),
  upload.single('cover'),
  classifyController.update
);

module.exports = router;
