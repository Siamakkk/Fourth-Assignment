const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

const Schema = mongoose.Schema

const PromotionSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: false,
        default: ''
    },
    label:{
      type: String,
      required: true,

    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description:{
        type: String,
        required: false,
        default: 'noting'
    }
},{
    timestamps: true
})

const Promotion = mongoose.model('promotion', PromotionSchema)

module.exports = Promotion