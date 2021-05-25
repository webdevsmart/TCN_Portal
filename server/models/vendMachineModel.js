const mongoose = require('mongoose');

const vendMachineSchema = mongoose.Schema({
    machineUID: {
        type: String,
        uppercase: true,
        unique: true,
        required: true
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
    logs : [{
        time: {
            type: Date,
            default: new Date('2021-01-01 00:00:00')
        },
        logType: String,
        logText: String,
        }
    ]
});

const VendMachine = mongoose.model('VendMachine', vendMachineSchema)

module.exports = VendMachine;