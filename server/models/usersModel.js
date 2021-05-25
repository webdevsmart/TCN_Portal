const mongoose = require('mongoose');
const { ROLE_MEMBER, ROLE_CLIENT, ROLE_OWNER, ROLE_ADMIN } = require('../constants.js');

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
        enum: [ROLE_MEMBER, ROLE_CLIENT, ROLE_OWNER, ROLE_ADMIN],
        default: ROLE_MEMBER
    },
},
{
  timestamps: true
});

const User = mongoose.model('User', UserSchema)

module.exports = User;
