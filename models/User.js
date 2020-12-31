const mongoose = require('mongoose');
const moment = require('moment')

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    room: {
        type: Array,
        required: false,
        default: []
    },
    status:{
        type: String,
        required: false
    }
    });
const User = mongoose.model('User', UserSchema)
module.exports = User
