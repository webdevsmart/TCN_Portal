const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const {STATUS_ACTIVE, STATUS_DEACTIVE} = require('../../constants.js');

const productSchema = mongoose.Schema({
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
    categoryId: {
        type: ObjectId,
        required: true,
        ref: 'productCategory'
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: [STATUS_ACTIVE, STATUS_DEACTIVE],
        default: STATUS_DEACTIVE
    },
    description: {
        type: String,
    },
    imageFile: {
        type: String,
        required: true,
    }
},
{
  timestamps: true
});

const product = mongoose.model('product', productSchema);

module.exports = product;
