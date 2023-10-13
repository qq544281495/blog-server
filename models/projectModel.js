const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    technology: {
      type: String,
      required: true,
    },
    links: [
      {
        name: String,
        link: String,
      },
    ],
    editContent: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
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

module.exports = mongoose.model('Project', ProjectSchema, 'projects');
