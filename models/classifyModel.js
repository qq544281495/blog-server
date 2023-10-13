const mongoose = require('mongoose');

const classifySchema = new mongoose.Schema(
  {
    classify: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      require: true,
    },
    remark: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Classify', classifySchema, 'classifys');
