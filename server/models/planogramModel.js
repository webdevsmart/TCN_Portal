const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const { RELEASE_TYPE, YES, NO } = require('../constants');

const planogramModel = mongoose.Schema({
    machineId: {
        type: ObjectId,
        required: true,
        unique: true,
        ref: 'vendmachine'
    },
    machineUID: {
        type: String,
        require: true
    },
    rows: [{
        rowLabel: String,
        maxHeight: String,
        aisleNumber: Number,
        aisles: [{
            aisleNum: Number,
            minWeight: { 
                type: String 
            },
            minWidth: {
                type: String
            },
            useConveyorBelt: {
                type: String,
                enum: [YES, NO],
                default: YES
            },
            releaseType: {
                type: String,
                enum: RELEASE_TYPE,
                default: RELEASE_TYPE[0],
            },
            releaseSize: String,
            maxQty: {
                type: Number,
                default: 10
            },
            products: [{
                productId: {
                    type: ObjectId,
                    ref: 'product'
                },
                price: String,
                height: String,
                weight: String,
                qty: Number,
            }],
            imageUrl: String
        }]
    }],
    saleSequence: [{
        productId: {
            type: ObjectId,
            ref: 'product'
        },
        sequence: [{
            aisleNum: Number,
        }],
    }]
});

const Planogram = mongoose.model('Planogram', planogramModel);

module.exports = Planogram;
