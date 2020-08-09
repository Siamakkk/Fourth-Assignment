const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema

const User = new Schema({
    firstname: {
        type: String,
        default: ' '
    },
    lastname:{
        type: String,
        default: ' '
    },
    facebookId: {
        type: String
    },
    admin:{
        type: Boolean,
        default: false
    },
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)


