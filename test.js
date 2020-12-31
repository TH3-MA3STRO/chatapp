// const User = require('./models/User')
// const Room = require('./models/Room')
// const Invite = require('./models/Invite')
// const mongoose = require('mongoose');
// //'a377504f41c44379a66c865d368f2589' 2nd
// //7bb40ea750dc44538f43c1b1c7d9c938 fis

// const db = require('./config/keys').MONGO_URI
// mongoose.connect(db,{useUnifiedTopology: true, useNewUrlParser: true}, (err,database)=>{
//     if(err){throw err}
//     const inv1 = new Invite({
//         toInvite: 'th3_ma3stro',
//         senderName: 'Random',
//         senderUsername: 'leggo',
//         roomName: 'firstroom',
//         roomID:'7bb40ea750dc44538f43c1b1c7d9c938',
//     })
//     const inv2 = new Invite({
//         toInvite: 'th3_ma3stro',
//         senderName: 'Random',
//         senderUsername: 'leggo',
//         roomName: 'secondroom',
//         roomID:'a377504f41c44379a66c865d368f2589',
//     })
//     const inv3 = new Invite({
//         toInvite: 'leggo',
//         senderName: 'Satyam Jha',
//         senderUsername: 'th3_ma3stro',
//         roomName: 'firstroom',
//         roomID:'7bb40ea750dc44538f43c1b1c7d9c938',
//     })
//     const inv4 = new Invite({
//         toInvite: 'leggo',
//         senderName: 'Satyam Jha',
//         senderUsername: 'th3_ma3stro',
//         roomName: 'secondroom',
//         roomID:'a377504f41c44379a66c865d368f2589',
//     })

//     inv1.save()
//     inv2.save()
//     inv3.save()
//     inv4.save()
// })