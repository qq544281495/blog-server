const express = require('express');
const router = new express.Router();
const projectController = require('../controller/projectController');
const {verifyToken} = require('../util/jwt'); // 用户身份验证
const multer = require('multer');

// 发布项目介绍
router.post(
  '/create',
  verifyToken(),
  multer({dest: 'public/projectImage/'}).single('cover'),
  projectController.create
);
// 查询项目介绍
router.post('/search', projectController.search);
// 获取项目介绍详情
router.post('/detail', projectController.detail);
// 更新项目介绍
router.put(
  '/update',
  verifyToken(),
  multer({dest: 'public/projectImage/'}).single('cover'),
  projectController.update
);
// 删除项目介绍
router.delete('/delete', verifyToken(), projectController.delete);

module.exports = router;
