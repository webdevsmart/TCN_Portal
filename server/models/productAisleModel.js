const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductAisleSchema = mongoose.Schema({
    productID: {
        type: ObjectId,
        required: true,
        ref: 'Product'
    },
    machineID: {
        type: ObjectId,
        required: true,
        ref: 'VendMachine'
    },
    aisleNum: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    addedOn: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const ProductAisle = mongoose.model('ProductAisle', ProductAisleSchema);

module.exports = ProductAisle;
