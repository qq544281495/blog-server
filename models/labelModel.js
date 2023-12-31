const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    classify: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Classify',
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

module.exports = mongoose.model('Label', labelSchema, 'labels');
