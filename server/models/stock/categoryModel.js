const mongoose = require('mongoose');
const {YES, NO} = require('../../constants.js');

const productCategorySchema = mongoose.Schema({
  code: {
      type: String,
      unique: true,
      required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  isDelete: {
    type: String,
    enum: [YES, NO],
    default: NO
  }
},
{
  timestamps: true
});

const productCategory = mongoose.model('productCategory', productCategorySchema);

module.exports = productCategory;
