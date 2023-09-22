const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');
const validator = require('../middleware/validator/userValidator'); // 用户输入验证
const {verifyToken} = require('../util/jwt'); // 用户身份验证
const multer = require('multer');
const upload = multer({dest: 'public/userPortrait/'});

// 注册
router.post('/register', validator.register, userController.register);
// 登录
router.post('/login', validator.login, userController.login);
// 上传用户头像
router.post(
  '/portrait',
  verifyToken(),
  upload.single('portrait'),
  userController.portrait
);

module.exports = router;
