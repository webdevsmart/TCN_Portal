const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const {STATUS_ACTIVE, STATUS_DEACTIVE, YES, NO} = require('../../constants.js');

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
    sku: {
        type: String,
    },
    brand: {
        type: String,
    },
    categoryId: {
        type: ObjectId,
        required: true,
        ref: 'productCategory'
    },
    price: {
        type: Number,
    },
    buyPrice: {
        type: Number,
    },
    taxRate: {
        type: String,
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

const product = mongoose.model('product', productSchema);

module.exports = product;
