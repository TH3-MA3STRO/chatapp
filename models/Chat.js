const mongoose = require('mongoose');
const moment = require('moment')

const ChatSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
        default: moment().format('h:mm a')},
    });
const Chat = mongoose.model('Chat', ChatSchema)
module.exports = Chat
