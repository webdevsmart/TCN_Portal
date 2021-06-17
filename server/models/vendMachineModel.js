const mongoose = require('mongoose');
const {STATUS_ACTIVE, STATUS_DEACTIVE} = require('../constants.js');

const vendMachineSchema = mongoose.Schema({
    machineName: {
        type: String,
    },
    machineUID: {
        type: String,
        uppercase: true,
        unique: true,
        required: true
    },
    siteID: {
        type: String
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: [STATUS_ACTIVE, STATUS_DEACTIVE],
        default: STATUS_DEACTIVE
    },
    config: {
        VERSION: String,
        DEV_NAME: String,
        CONF_CHECK_INTERVAL: String,
        NET_USER: String,
        NET_PASS: String,
        DIALUP_APN: String,
        REMOTE_SRVR: String,
        FTP_SRVR: String,
        FTP_USER: String,
        FTP_PASS: String,
        SMS_NUMS: String,
        SRVC_NUM: String,
        DEX_UPD_INTERVAL: String,
        DEX_SRVR: String,
        ACCEL_THRESH: String,
        PAY_SRVR_URL: String,
        PAY_SRVR_PORT: String,
        PAY_APPR_AMNT: String,
        MERCHANT_FEE: String,
        DEV_HASH: String,
        DEV_OPER_FLAGS: String,
    },
    height: {
        type: Number,
    },
    width: {
        type: Number,
    },
    rowNum: {
        type: Number,
        default: 6
    },
    rowLabel: {
        type: String,
        default: 'A-Z'
    },
    aisleLabel: {
        type: String,
        default: '1-99'
    },
    maxAisleNum: {
        type: Number,
        default: 10
    },
    maxRowHeight: {
        type: Number,
        default: 6
    },
});

const VendMachine = mongoose.model('VendMachine', vendMachineSchema)

module.exports = VendMachine;