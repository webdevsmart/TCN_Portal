const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const planogramModel = mongoose.Schema({
    machineId: {
        type: ObjectId,
        required: true,
        unique: true,
        ref: 'vendmachine'
    },
    rows: [{
        rowCode: String,
        aisles: [{
            aisleNum: Number,
            width: String,
            height: String,
            maxQty: {
                type: Number,
                default: 10
            },
            productId: {
                type: ObjectId,
                ref: 'product'
            },
            price: String,
            qty: Number,
            imageUrl: String
        }]
    }]
});

const Planogram = mongoose.model('Planogram', planogramModel);

module.exports = Planogram;
