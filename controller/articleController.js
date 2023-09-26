const operate = require('../util/operate'); // 文件操作工具类
const Image = require('../models/imageModel'); // 用户数据模型

module.exports = {
  // 上传文章图片
  uploadImage: async (request, response) => {
    try {
      let {_id} = request.user;
      let {filename, originalname} = request.file;
      let extension = originalname.split('.').pop();
      let imageUrl = `${filename}.${extension}`;
      await operate.rename(
        `./public/articleImage/${filename}`,
        `./public/articleImage/${imageUrl}`
      );
      let params = {
        user: _id,
        articleImage: `/articleImage/${imageUrl}`,
      };
      const image = await Image(params);
      await image.save();
      response.status(200).json({data: params});
    } catch (error) {
      response.status(500).json({error});
    }
  },
  // 删除文章图片
  deleteImage: async (request, response) => {
    try {
      let {articleImage} = request.body;
      let {_id} = await Image.findOne({articleImage});
      await Image.findByIdAndDelete(_id);
      if (await operate.exists(`./public${articleImage}`)) {
        await operate.delete(`./public${articleImage}`);
        response.status(200).json({data: {message: '文章图片删除成功'}});
      }
    } catch (error) {
      response.status(500).json({error});
    }
  },
  // 上传文章
  uploadArticle: async (request, response) => {
    try {
      console.log(request.file);
      console.log(request.body);
    } catch (error) {
      response.status(500).json({error});
    }
  },
};
