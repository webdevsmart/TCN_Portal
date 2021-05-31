const mongoose = require('mongoose');

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
  }
},
{
  timestamps: true
});

const productCategory = mongoose.model('productCategory', productCategorySchema);

module.exports = productCategory;
