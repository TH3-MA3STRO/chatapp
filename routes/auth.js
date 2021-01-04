const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const passport = require('passport')
const router = require('express').Router()

const User = require('../models/User')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/authenticate')

router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register.ejs', { suggestions: [] })
})
router.post('/register', (req, res) => {
    const { name, username, passcreate, passconfirm } = req.body
    User.findOne({ username: username })
        .then(user => {
            if (user) {
                suggestions = [`${username}${Math.floor(Math.random() * Math.floor(10000))}`, `${username}${Math.floor(Math.random() * Math.floor(4))}`]
                res.render('register', {
                    name, username, suggestions, passcreate, passconfirm
                })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(passcreate, salt, (err, pass) => {
                        if (err) { throw err }
                        password = pass
                        const newUser = new User({
                            id: uuidv4().split('-').join(''),
                            name: name,
                            username: username,
                            password: password,
                        })
                        newUser.save().then(
                            user => {
                                req.flash('success', 'Account')
                                res.redirect('/login')
                            }
                        ).catch(err => console.log(err))
                    })
                })

            }
        })

})
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', { logout_msg: req.flash('error_msg'), success_msg: req.flash('success'), message: req.flash('error') })
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next)
})

router.get('/logout', (req, res, next) => {
    req.logout()
    req.flash('error_msg', 'You are logged out')
    res.redirect('/login')
})
module.exports = router
