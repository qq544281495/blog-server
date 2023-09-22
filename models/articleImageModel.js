const mongoose = require('mongoose');

const articleImageModel = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User',
  },
  articleImage: {
    type: String,
    require: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model(
  'ArticleImage',
  articleImageModel,
  'ArticleImages'
);
