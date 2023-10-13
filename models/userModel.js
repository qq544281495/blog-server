const mongoose = require('mongoose');
const md5 = require('../util/md5');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      set: (value) => md5(value), // 密码加密
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    portrait: {
      type: String,
      default: 'userPortrait/default.jpg',
    },
    updateDate: {
      type: Date,
      default: Date.now(),
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
    timestamps: {createdAt: 'createdDate', updatedAt: 'updateDate'},
  }
);

module.exports = mongoose.model('User', userSchema, 'users');
