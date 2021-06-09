const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const transactionSchema = mongoose.Schema({
    machineId: {
        type: ObjectId,
        required: true,
        ref: 'VendMachine'
    },
    machineUID: {
        type: String,
        required: true
    },
    devName: {
        type: String,
        required: true
    },
    siteId: {
        type: String,
        required: true
    },
    type : {
        type: String,
        enum: ["CARD", "CASH"],
        default: "CARD"
    },
    subType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["success", "failed"],
        default: "failed"
    },
    product: {
        productID: {
            type: ObjectId,
            required: true,
            unique: true,
            ref: 'product'
        },
        aisleNum: Number,
        price: Number
    },
    price: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
    },
    refund: {
        type: Number,
    },
    failReason: {
        type: String,
        required: true,
    },
    tubeLevelBefore: {
        type: Number
    },
    tubeLevelAfter: {
        type: Number
    }
});

const transaction = mongoose.model('transaction', transactionSchema);

module.exports = transaction;
