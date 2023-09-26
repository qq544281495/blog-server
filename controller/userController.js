const User = require('../models/userModel'); // 用户数据模型
const {signToken} = require('../util/jwt');
const operate = require('../util/operate'); // 文件操作工具类

// 保存头像
async function savePortrait(id, filename, originalname) {
  let extension = originalname.split('.').pop();
  let portrait = `${filename}.${extension}`;
  await operate.rename(
    `./public/userPortrait/${filename}`,
    `./public/userPortrait/${portrait}`
  );
  await User.findByIdAndUpdate(id, {portrait: `/userPortrait/${portrait}`});
}

module.exports = {
  // 用户注册
  register: async (request, response) => {
    try {
      const params = request.body;
      const user = await User(params);
      await user.save();
      response.status(200).json({data: {message: '用户注册成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  // 用户登录
  login: async (request, response) => {
    try {
      const params = request.body;
      const user = await User.findOne(params);
      if (user) {
        const data = user.toJSON();
        data.token = await signToken(data);
        response.status(200).json({data});
      } else {
        response.status(400).json({error: '邮箱或密码错误'});
      }
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  // 上传头像
  portrait: async (request, response) => {
    try {
      let {_id} = request.user;
      const user = await User.findById(_id);
      let {filename, originalname} = request.file;
      if (user.portrait) {
        if (await operate.exists(`./public/userPortrait/${user.portrait}`)) {
          // 用户信息存在头像且服务器本地存有头像文件(删除原有头像上传新头像)
          await operate.delete(`./public/userPortrait/${user.portrait}`);
          savePortrait(_id, filename, originalname);
          response.status(200).json({data: {message: '头像修改成功'}});
        } else {
          // 用户信息存在头像但服务器本地丢失或不存在头像文件(上传新头像)
          savePortrait(_id, filename, originalname);
          response.status(200).json({data: {message: '头像修改成功'}});
        }
      } else {
        savePortrait(_id, filename, originalname);
        response.status(200).json({data: {message: '头像修改成功'}});
      }
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
};
