const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    editContent: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    classify: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Classify',
    },
    label: {
      type: [mongoose.ObjectId],
      required: true,
      ref: 'Label',
    },
    cover: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    publish: {
      type: Number,
      enum: [1, 0],
      required: true,
      default: 1,
    },
    updateDate: {
      type: Date,
      default: Date.now(),
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
    timestamps: {createdAt: 'createdDate', updatedAt: 'updateDate'},
  }
);

module.exports = mongoose.model('Article', articleSchema, 'articles');
