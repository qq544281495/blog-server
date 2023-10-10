const operate = require('../util/operate'); // 文件操作工具类
const Project = require('../models/projectModel'); // 项目数据模型

async function deleteCover(url) {
  if (await operate.exists(url)) {
    await operate.delete(url);
  }
}

module.exports = {
  create: async (request, response) => {
    try {
      let {...params} = request.body;
      let {filename, originalname} = request.file;
      let extension = originalname.split('.').pop();
      let imageUrl = `${filename}.${extension}`;
      await operate.rename(
        `./public/projectImage/${filename}`,
        `./public/projectImage/${imageUrl}`
      );
      params.cover = `/projectImage/${imageUrl}`;
      let project = await Project(params);
      await project.save();
      response.status(200).json({data: {message: '项目发布成功'}});
    } catch (error) {
      response.status(500).json({error});
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
      if (name) params.name = new RegExp(name, 'i');
      if (typeof publish === 'number') params.publish = publish;
      let list = await Project.find(params)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
      let count = await Project.countDocuments(params);
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
  detail: async (request, response) => {
    try {
      let id = request.body.id;
      let data = await Project.findById(id);
      response.status(200).json({data});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  update: async (request, response) => {
    try {
      let {id, ...params} = request.body;
      let project = await Project.findById(id);
      if (project) {
        if (request.file) {
          let deleteImageUrl = `./public${project.cover}`;
          if (deleteImageUrl.indexOf('projectImage') != -1) {
            await deleteCover(deleteImageUrl);
          }
          let {filename, originalname} = request.file;
          let extension = originalname.split('.').pop();
          let imageUrl = `${filename}.${extension}`;
          await operate.rename(
            `./public/projectImage/${filename}`,
            `./public/projectImage/${imageUrl}`
          );
          params.cover = `/projectImage/${imageUrl}`;
        }
        await Project.findByIdAndUpdate(id, params);
        response.status(200).json({data: {message: '项目更新完成'}});
      } else {
        response.status(404).json({error: '项目不存在'});
      }
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
  delete: async (request, response) => {
    try {
      let {id} = request.body;
      if (Array.isArray(id)) {
        let project = await Project.find({_id: {$in: id}});
        if (project.length === 0) {
          return response.status(404).json({error: '项目不存在'});
        }
        for (item of project) {
          let imageUrl = `./public${item.cover}`;
          if (imageUrl.indexOf('projectImage') != -1) {
            await deleteCover(imageUrl);
          }
        }
        await Project.deleteMany({_id: {$in: id}});
      } else {
        let project = await Project.findById(id);
        if (!project) {
          return response.status(404).json({error: '项目不存在'});
        }
        let imageUrl = `./public${project.cover}`;
        if (imageUrl.indexOf('projectImage') != -1) {
          await deleteCover(imageUrl);
        }
        await Project.findByIdAndDelete(id);
      }
      response.status(200).json({data: {message: '项目删除成功'}});
    } catch (error) {
      response.status(500).json({error: error.message});
    }
  },
};
