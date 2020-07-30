const mongoose = require('mongoose')

const Schema = mongoose.Schema

const leaderSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false,
        defualt: 'without picture'
    },
    designation:{
        type: String,
        default: '',
        required: false
    },
    abbr:{
        type: String,
        required: true
    },
    description: {
        type: String,
        defualt: '',
        required: false
    }
},{
    timestamps: true
})

const leader = mongoose.model('leader', leaderSchema)

module.exports = leader