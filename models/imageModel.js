const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },
    image: {
      type: String,
      require: true,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
    timestamps: {createdAt: 'createdDate'},
  }
);

module.exports = mongoose.model('Image', imageSchema, 'images');
