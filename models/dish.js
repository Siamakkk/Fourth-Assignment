const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

const Schema = mongoose.Schema 

const commentSchema = new Schema({
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    comment:{
        type: String,
        required: true,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Dish = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    label:{
        type: String,
        default: ''
    },
    featured:{
        type: Boolean,
        default: false
    },
    price:{
        type: Currency,
        required: true,
        min: 0
    },
    comments: [ commentSchema ]
},{
    timestamps: true
})


module.exports = mongoose.model('Dish', Dish)
 