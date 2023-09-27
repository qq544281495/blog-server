const Label = require('../models/labelModel'); // 用户数据模型

module.exports = {
  create: async (request, response) => {
    try {
      let params = request.body;
      let label = await Label(params);
      await label.save();
      response.status(200).json({data: {message: '标签创建成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  search: async (request, response) => {
    try {
      let {pageNumber, pageSize, label, publish, ...params} = request.body;
      if (label) params.label = new RegExp(label, 'i');
      if (typeof publish === 'number') params.publish = publish;
      let list = await Label.find(params)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('classify', 'classify');
      let count = await Label.countDocuments(params);
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
  update: async (request, response) => {
    try {
      let {_id, ...params} = request.body;
      let label = await Label.findById(_id);
      if (label) {
        await Label.findByIdAndUpdate(_id, params);
        response.status(200).json({data: {message: '标签编辑成功'}});
      } else {
        response.status(404).json({error: '标签不存在'});
      }
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  delete: async (request, response) => {
    try {
      let {id} = request.body;
      if (Array.isArray(id)) {
        let label = await Label.find({_id: {$in: id}});
        if (label.length === 0) {
          return response.status(404).json({error: '标签不存在'});
        }
        await Label.deleteMany({_id: {$in: id}});
      } else {
        let label = await Label.findById(id);
        if (!label) {
          return response.status(404).json({error: '标签不存在'});
        }
        await Label.findByIdAndDelete(id);
      }
      response.status(200).json({data: {message: '标签删除成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
};
