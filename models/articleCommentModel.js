const mongoose = require('mongoose');

const articleCommentSchema = new mongoose.Schema({
  article: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Article',
  },
  content: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  publish: {
    type: Number,
    enum: [1, 0],
    required: true,
    default: 1,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model(
  'ArticleComment',
  articleCommentSchema,
  'articleComment'
);
