const mongoose = require('mongoose');
const moment = require('moment')

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    membersData:{
        type: Object,
        required: true,
    },
    time: {
        type: String,
        required: true,
        default: moment().format('MMMM Do YYYY, h:mm:ss')},
    });
const Room = mongoose.model('Room', RoomSchema)
module.exports = Room
