const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const router = require('express').Router()

const User = require('../models/User')
const Room = require('../models/Room')
const Invite = require('../models/Invite')
const { ensureAuthenticated, forwardAuthenticated, thrower } = require('../config/authenticate')

router.get('/home', ensureAuthenticated, (req, res) => {
    User.findOne({ username: req.user.username })
        .then(user => {
            res.render('home', { user: req.user, rooms: req.user.room })
        })
        .catch(thrower)
})

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create')
})
router.post('/create', ensureAuthenticated, (req, res) => {
    const newRoom = new Room({
        name: req.body.name.toString(),
        id: uuidv4().split('-').join(''),
        members: [req.user.name],
        membersData: {
            [req.user.username]: {
                name: req.user.name,
                username: req.user.username,
                id: req.user.id
            }
        },
        creator: req.user
    })
    newRoom.save().then(room => {
        res.redirect('/home')
        User.updateOne({ username: req.user.username }, { "$push": { room: newRoom } }, (err, response) => {
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
                    res.render('chat', { room: room, roomjs: JSON.stringify(room), user: req.user, userjs: JSON.stringify(req.user), isCreator: room.creator.username===req.user.username, msg: req.flash('msg'), isRedirected: req.flash('redirect') })
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
                res.render('invitation', { invite: [] })
            } else {
                res.render('invitation', { invite: inviteArr })
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
                                        room.update({ "$set": { [a]: { name: req.user.name, username: req.user.username, id: req.user.id } }, "$addToSet": { members: req.user.name } }, (err, res) => {
                                            if (err) { throw err }
                                        })
                                        User.findOneAndUpdate({ username: req.user.username }, { "$push": { room: room } }, (err, response) => {
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
                    res.send('sasasa')
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
})
module.exports = router