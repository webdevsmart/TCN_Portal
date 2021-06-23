const mongoose = require('mongoose');
const { USER_ROLE, STATUS_ACTIVE, STATUS_DEACTIVE } = require('../constants.js');

const UserSchema = mongoose.Schema({
    profile: {
        name: { type: String },
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: USER_ROLE,
        default: USER_ROLE[0]
    },
    status: {
        type: String,
        enum: [STATUS_ACTIVE, STATUS_DEACTIVE],
        default: STATUS_DEACTIVE
    },
    siteID: [],
},
{
  timestamps: true
});

const User = mongoose.model('User', UserSchema)

module.exports = User;
