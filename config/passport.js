const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')


module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
        User.findOne({ username: username })
        .then(user => {
            if (!user) { return done(null, false, { message: 'User not found' }) }
            if (user) {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) { throw err }
                    if (isMatch) {
                        return done(null, user)
                    } else { return done(null, false, { message: "Password incorrect" })}
                })
            }})
        .catch(err => { throw err })
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
// module.exports = function (passport) {
//     passport.use(
//         new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//             // Match user
//             User.findOne({
//                 email: email
//             }).then(user => {
//                 if (!user) {
//                     return done(null, false, { message: 'That email is not registered' });
//                 }

//                 // Match password
//                 bcrypt.compare(password, user.password, (err, isMatch) => {
//                     if (err) throw err;
//                     if (isMatch) {
//                         return done(null, user);
//                     } else {
//                         return done(null, false, { message: 'Password incorrect' });
//                     }
//                 });
//             });
//         })
//     );

//     passport.serializeUser(function (user, done) {
//         done(null, user.id);
//     });

//     passport.deserializeUser(function (id, done) {
//         User.findById(id, function (err, user) {
//             done(err, user);
//         });
//     });
// };
