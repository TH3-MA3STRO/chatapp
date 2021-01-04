const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const router = require('express').Router()

const User = require('../models/User')
const Room = require('../models/Room')
const Invite = require('../models/Invite')
const { ensureAuthenticated, forwardAuthenticated, thrower } = require('../config/authenticate')

router.get('/home', ensureAuthenticated, (req, res) => {

    Room.find({ 'members.username': req.user.username })
        .then(rooms => {
            res.render('home', { user: req.user, rooms: rooms })
        })
        .catch(thrower)
})

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create', { user: req.user })
})

router.post('/create', ensureAuthenticated, (req, res) => {
    const newRoom = new Room({
        name: req.body.name.toString(),
        id: uuidv4().split('-').join(''),
        members: [{ name: req.user.name, username: req.user.username }],
        membersData: {
            [req.user.username]: {
                name: req.user.name,
                username: req.user.username,
                id: req.user.id
            }
        },
        creator: req.user.username
    })
    newRoom.save().then(room => {
        res.redirect('/home')
        User.updateOne({ username: req.user.username }, { "$push": { room: newRoom.id } }, (err, response) => {
            if (err) { throw err }
        })

    }).catch(err => { throw err })
})

router.get('/room/:id', ensureAuthenticated, (req, res, next) => {
    Room.findOne({ id: req.params.id })
        .then(room => {
            if (!room) {
                next()
            } else {
                if (req.user.username in room.membersData) {
                    res.render('chat', { room: room, roomjs: JSON.stringify(room), user: req.user, userjs: JSON.stringify(req.user), isCreator: room.creator === req.user.username, msg: req.flash('msg'), isRedirected: req.flash('redirect') })
                } else {
                    next()
                }
            }
        })
})

router.get('/invitations', ensureAuthenticated, (req, res) => {
    Invite.find({ toInvite: req.user.username })
        .then(inviteArr => {
            if (!inviteArr) {
                res.render('invitation', { invite: [], user: req.user })
            } else {
                res.render('invitation', { invite: inviteArr, user: req.user })
            }
        })
})

router.get('/invitation/:id/:dec', ensureAuthenticated, (req, res, next) => {
    if (req.params.dec === 'accept') {
        Invite.findOneAndDelete({ _id: req.params.id })
            .then(invite => {
                if (!invite) {
                    next()
                } else {
                    if (invite.toInvite === req.user.username) {
                        Room.findOne({ id: invite.roomID })
                            .then(room => {
                                if (room) {
                                    if (req.user.username in room.membersData) {
                                        res.redirect('/invitations')
                                    } else {
                                        a = `membersData.${req.user.username}`
                                        room.update({ "$set": { [a]: { name: req.user.name, username: req.user.username, id: req.user.id } }, "$addToSet": { members: { name: req.user.name, username: req.user.username } } }, (err, res) => {
                                            if (err) { throw err }
                                        })
                                        User.findOneAndUpdate({ username: req.user.username }, { "$push": { room: room.id } }, (err, response) => {
                                            if (err) { throw err }
                                            res.redirect('/invitations')
                                        })
                                    }
                                } else {
                                    next()
                                }
                            })
                    } else {
                        next()
                    }
                }
            })
    } else if (req.params.dec === 'decline') {
        Invite.findOneAndDelete({ _id: req.params.id })
            .then(inv => {
                if (!inv) {
                    res.redirect('/invitations')
                }
            })
    } else {
        next()
    }
})

router.post('/invite', ensureAuthenticated, (req, res) => {
    let to = req.body.username
    let roomname = req.body.roomname
    let roomid = req.body.roomid
    Invite.findOne({ toInvite: to }).then(invite => {
        if (invite) {
            req.flash('error_msg', 'already invited')
            req.flash('redirect', 'true')
            res.redirect(`/room/${roomid}`)
        }
        else {
            User.findOne({ username: to }).then(user => {
                if (!user) {
                    req.flash('msg', 'user not found!')
                    req.flash('redirect', 'true')
                    res.redirect(`/room/${roomid}`)
                } else {
                    Room.findOne({ id: roomid }).then(
                        room => {
                            if (!room) {
                                // req.flash('error_msg', 'room not found')
                                res.redirect(`/room/${roomid}`)
                            } else {
                                if (to in room.membersData) {
                                    req.flash('msg', 'already a member')
                                    req.flash('redirect', 'true')
                                    res.redirect(`/room/${roomid}`)
                                } else {
                                    const newInvite = Invite({
                                        toInvite: to,
                                        senderName: req.user.name,
                                        senderUsername: req.user.username,
                                        roomName: roomname,
                                        roomID: roomid
                                    })
                                    newInvite.save()
                                        .then(resp => {
                                            req.flash('msg', 'success')
                                            req.flash('redirect', 'true')
                                            res.redirect(`/room/${roomid}`)
                                        }
                                        )
                                }
                            }
                        }
                    )
                }
            })
        }
    })
})
router.get('/:id/rsettings', ensureAuthenticated, (req, res, next) => {
    const roomid = req.params.id
    Room.findOne({ id: roomid })
        .then(room => {
            res.render('roomsettings', { room: room, user: req.user })
        })
})
router.post('/rename', ensureAuthenticated, (req, res, next) => {
    const newName = req.body.gname
    const roomid = req.body.roomid
    Room.findOne({ id: roomid })
        .then(room => {
            if (room) {
                if (room.creator === req.user.username) {
                    room.update({ "$set": { name: newName } }, (err, response) => {
                        if (err) { throw err }
                        res.redirect('/roomsettings/' + roomid)
                    })
                } else {
                    next()
                }
            } else {
                next()
            }
        })
})
router.get('/kick/:roomid/:uname', ensureAuthenticated, (req, res, next) => {
    const toKick = req.params.uname
    Room.findOne({ id: req.params.roomid })
        .then(room => {
            if (room) {
                if (req.user.username === room.creator) {
                    if (toKick === room.creator) {
                        next()
                    } else {
                        User.findOne({ username: toKick })
                            .then(user => {
                                if (user) {
                                    room.update({ "$pull": { "members": { "username": toKick } }, "$unset": { [`membersData.${toKick}`]: "" } }, { safe: true, multi: true }, (err, res) => {
                                        if (err) { throw err }
                                        else {
                                            user.update({ $pull: { room: req.params.roomid } }, (err, res) => {
                                                if (err) { throw err }
                                                res.redirect('/roomsettings/' + req.params.roomid)
                                            })
                                        }
                                    })
                                } else {
                                    next()
                                }
                            })
                    }
                }
            } else {
                next()
            }
        })
})
router.get('/:user/usettings', ensureAuthenticated, (req, res) => {
    User.findOne({ username: req.params.user })
        .then(user => {
            res.render('usersettings', { user, suggestions: req.flash('use'), trUname: req.flash('tried') })
        })
})
router.post('/edituser', ensureAuthenticated, (req, res, next) => {
    let newName = req.body.name
    let newUsername = req.body.username
    User.findOne({ username: newUsername })
        .then(user1 => {
            if (user1) {
                req.flash('use', 'error taken')
                req.flash('tried', newUsername)
                res.redirect(`/${req.user.username}/usettings`)
            } else {
                User.findOne({ username: req.user.username })
                    .then(user => {
                        if (user) {
                            user.update({ $set: { name: newName, username: newUsername } }, (err, resp) => {
                                if (err) { throw err }
                                res.redirect(`/${newUsername}/usettings`)
                            })
                        } else {
                            next()
                        }
                    })

            }
        })
})
module.exports = router
