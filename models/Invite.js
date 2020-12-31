const mongoose = require('mongoose');
const moment = require('moment')

const InviteSchema = new mongoose.Schema({
    toInvite: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    senderUsername: {
      type: String,
      required: true,
    },
    roomName: {
        type: String,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
    },
    });
const Invite = mongoose.model('Invite', InviteSchema)
module.exports = Invite
