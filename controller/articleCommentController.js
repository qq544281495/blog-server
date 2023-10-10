const ArticleComment = require('../models/articleCommentModel'); // 文章评论数据模型

module.exports = {
  publish: async (request, response) => {
    try {
      let params = request.body;
      let comment = await ArticleComment(params);
      await comment.save();
      response.status(200).json({data: {message: '发表评论成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  search: async (request, response) => {
    try {
      let {
        pageNumber = 1,
        pageSize = 10,
        name,
        publish,
        ...params
      } = request.body;
      if (typeof publish === 'number') params.publish = publish;

      if (name) params.name = new RegExp(name, 'i');
      let list = await ArticleComment.find(params)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('article', 'title');
      let count = await ArticleComment.countDocuments(params);
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
        let comment = await ArticleComment.find({_id: {$in: id}});
        if (comment.length === 0) {
          return response.status(404).json({error: '文章评论不存在'});
        }
        await ArticleComment.deleteMany({_id: {$in: id}});
      } else {
        let comment = await ArticleComment.findById(id);
        if (!comment) {
          return response.status(404).json({error: '文章评论不存在'});
        }
        await ArticleComment.findByIdAndDelete(id);
      }
      response.status(200).json({data: {message: '文章评论删除成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  update: async (request, response) => {
    try {
      let {id, ...params} = request.body;
      const comment = await ArticleComment.findById(id);
      if (comment) {
        await ArticleComment.findByIdAndUpdate(id, params);
        response.status(200).json({data: {message: '文章评论修改成功'}});
      } else {
        response.status(404).json({error: '文章评论不存在'});
      }
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
};
