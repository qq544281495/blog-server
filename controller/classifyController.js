const operate = require('../util/operate'); // 文件操作工具类
const Classify = require('../models/classifyModel'); // 分类数据模型

// 删除分类默认封面
async function deleteCover(url) {
  if (await operate.exists(url)) {
    await operate.delete(url);
  }
}

module.exports = {
  create: async (request, response) => {
    try {
      let {filename, originalname} = request.file;
      let extension = originalname.split('.').pop();
      let imageUrl = `${filename}.${extension}`;
      await operate.rename(
        `./public/classifyImage/${filename}`,
        `./public/classifyImage/${imageUrl}`
      );
      let params = {
        classify: request.body.classify,
        remark: request.body.remark,
        publish: request.body.publish,
        cover: `/classifyImage/${imageUrl}`,
      };
      const classify = await Classify(params);
      await classify.save();
      response.status(200).json({data: {message: '创建分类成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  search: async (request, response) => {
    try {
      let {pageNumber, pageSize, classify, publish} = request.body;
      let params = {};
      if (classify) params.classify = new RegExp(classify, 'i');
      if (typeof publish === 'number') params.publish = publish;
      let list = await Classify.find(params)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
      let count = await Classify.countDocuments(params);
      let page = {
        pageNumber,
        pageSize,
        count,
      };
      response.status(200).json({data: {list, page}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  delete: async (request, response) => {
    try {
      let {id} = request.body;
      if (Array.isArray(id)) {
        let classify = await Classify.find({_id: {$in: id}});
        if (classify.length === 0) {
          return response.status(404).json({error: '分类不存在'});
        }
        for (item of classify) {
          let imageUrl = `./public${item.cover}`;
          await deleteCover(imageUrl);
        }
        await Classify.deleteMany({_id: {$in: id}});
      } else {
        let classify = await Classify.findById(id);
        if (!classify) {
          return response.status(404).json({error: '分类不存在'});
        }
        let imageUrl = `./public${classify.cover}`;
        await deleteCover(imageUrl);
        await Classify.findByIdAndDelete(id);
      }
      response.status(200).json({data: {message: '分类删除成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  update: async (request, response) => {
    try {
      let {id, ...params} = request.body;
      let classify = await Classify.findById(id);
      if (classify) {
        if (request.file) {
          let deleteImageUrl = `./public${classify.cover}`;
          await deleteCover(deleteImageUrl);
          let {filename, originalname} = request.file;
          let extension = originalname.split('.').pop();
          let imageUrl = `${filename}.${extension}`;
          await operate.rename(
            `./public/classifyImage/${filename}`,
            `./public/classifyImage/${imageUrl}`
          );
          params.cover = `/classifyImage/${imageUrl}`;
        }
        await Classify.findByIdAndUpdate(id, params);
      } else {
        return response.status(404).json({error: '分类不存在'});
      }
      response.status(200).json({data: {message: '分类编辑成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
};
