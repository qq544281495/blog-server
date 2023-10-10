const operate = require('../util/operate'); // 文件操作工具类
const Article = require('../models/articleModel'); // 文章数据模型
const Classify = require('../models/classifyModel'); // 分类数据模型

async function deleteCover(url) {
  if (await operate.exists(url)) {
    await operate.delete(url);
  }
}

module.exports = {
  // 上传文章
  uploadArticle: async (request, response) => {
    try {
      let {...params} = request.body;
      params.label = params.label.split(',');
      if (request.file) {
        let {filename, originalname} = request.file;
        let extension = originalname.split('.').pop();
        let imageUrl = `${filename}.${extension}`;
        await operate.rename(
          `./public/articleImage/${filename}`,
          `./public/articleImage/${imageUrl}`
        );
        params.cover = `/articleImage/${imageUrl}`;
      } else {
        let articleClassify = await Classify.findById(params.classify);
        params.cover = articleClassify.cover;
      }
      let article = await Article(params);
      await article.save();
      response.status(200).json({data: {message: '文章发布成功'}});
    } catch (error) {
      response.status(500).json({error});
    }
  },
  // 查询文章
  search: async (request, response) => {
    try {
      let {
        pageNumber = 1,
        pageSize = 10,
        title,
        publish,
        ...params
      } = request.body;
      if (title) params.title = new RegExp(title, 'i');
      if (typeof publish === 'number') params.publish = publish;
      if (params.classify === '') delete params.classify;
      let list = await Article.find(params)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('classify', 'classify')
        .populate('label', 'label');
      let count = await Article.countDocuments(params);
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
  // 获取文章详情
  detail: async (request, response) => {
    try {
      let id = request.body.id;
      let data = await Article.findById(id)
        .populate('classify', 'classify')
        .populate('label', 'label');
      response.status(200).json({data});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  // 更新文章
  update: async (request, response) => {
    try {
      let {id, ...params} = request.body;
      let article = await Article.findById(id);
      if (article) {
        if (request.file) {
          let deleteImageUrl = `./public${article.cover}`;
          if (deleteImageUrl.indexOf('articleImage') != -1) {
            await deleteCover(deleteImageUrl);
          }
          let {filename, originalname} = request.file;
          let extension = originalname.split('.').pop();
          let imageUrl = `${filename}.${extension}`;
          await operate.rename(
            `./public/articleImage/${filename}`,
            `./public/articleImage/${imageUrl}`
          );
          params.cover = `/articleImage/${imageUrl}`;
        }
        await Article.findByIdAndUpdate(id, params);
        response.status(200).json({data: {message: '文章更新完成'}});
      } else {
        response.status(404).json({error: '文章不存在'});
      }
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  // 删除文章
  delete: async (request, response) => {
    try {
      let {id} = request.body;
      if (Array.isArray(id)) {
        let article = await Article.find({_id: {$in: id}});
        if (article.length === 0) {
          return response.status(404).json({error: '文章不存在'});
        }
        for (item of article) {
          let imageUrl = `./public${item.cover}`;
          if (imageUrl.indexOf('articleImage') != -1) {
            await deleteCover(imageUrl);
          }
        }
        await Article.deleteMany({_id: {$in: id}});
      } else {
        let article = await Article.findById(id);
        if (!article) {
          return response.status(404).json({error: '文章不存在不存在'});
        }
        let imageUrl = `./public${article.cover}`;
        if (imageUrl.indexOf('articleImage') != -1) {
          await deleteCover(imageUrl);
        }
        await Article.findByIdAndDelete(id);
      }
      response.status(200).json({data: {message: '文章删除成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
};
