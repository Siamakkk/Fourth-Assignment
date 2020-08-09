const mongoose = require('mongoose')
const Schema = mongoose.Schema

const faveDishSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  }  
})

const FavoriteSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    faveDishes : [ faveDishSchema ]
})


const Favorite = mongoose.model('Favorite', FavoriteSchema)

module.exports = Favorite