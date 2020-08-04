const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const User = require('../models/user')
// const { authenticate } = require('passport')
const authenticate = require('../authenticate')

const router = express.Router()

router.use(bodyParser.json())

//listing all user just for admin
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then((users) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({users: users})
  })
})

//SignUp route
router.post('/signup', (req, res) => {
  User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500
      res.setHeader('COntent-Type', 'application/json')
      res.json({err : err})
    }
    else {
      if(req.body.firstname) user.firstname = req.body.firstname
      if(req.body.lastname) user.lastname = req.body.lastname
      user.save((err, user) => {
        if(err){
          res.statusCode = 500
          res.setHeader('COntent-Type', 'application/json')
          res.json({err : err})
        }
        passport.authenticate('local')(req, res, (err, user) => {
          res.statusCode = 200
          res.setHeader('COntent-Type', 'text/plain')
          res.json({
            success: true,
            status: 'registration successful'
          })
        })
      }) 
    }
  })
})

//login route
router.post('/login', passport.authenticate('local'), (req, res, next) => {  
  const token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.json({
    success: true,
    token: token,
    status: 'You are  successfully logged in !'
  })
})

//logout route
router.get('/logout', (req, res, next) => {
  if(req.session){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else {
    const err = new Error('You are already loged out')
    err.status = 403
    next(err)
  }
})

module.exports = router


