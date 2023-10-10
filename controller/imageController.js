const Image = require('../models/imageModel'); // 文章图片数据模型
const operate = require('../util/operate'); // 文件操作工具类

module.exports = {
  // 上传图片
  uploadImage: async (request, response) => {
    try {
      let {_id} = request.user;
      let {filename, originalname} = request.file;
      let extension = originalname.split('.').pop();
      let imageUrl = `${filename}.${extension}`;
      await operate.rename(
        `./public/image/${filename}`,
        `./public/image/${imageUrl}`
      );
      let params = {
        user: _id,
        image: `/image/${imageUrl}`,
      };
      const image = await Image(params);
      await image.save();
      response.status(200).json({data: params});
    } catch (error) {
      response.status(500).json({error});
    }
  },
  // 删除图片
  deleteImage: async (request, response) => {
    try {
      let {image} = request.body;
      let {_id} = await Image.findOne({image});
      await Image.findByIdAndDelete(_id);
      if (await operate.exists(`./public${image}`)) {
        await operate.delete(`./public${image}`);
        response.status(200).json({data: {message: '文章图片删除成功'}});
      }
    } catch (error) {
      response.status(500).json({error});
    }
  },
};
