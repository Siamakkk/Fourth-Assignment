const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

const connect = mongoose.connect('mongodb://localhost:27017/conFusion', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const dishRouter = require('./routes/dishRoute')
const leaderRouter = require('./routes/leaderRoute')
const promotionRouter = require('./routes/promotionRoute')
const { Buffer } = require('buffer')

const app = express()
//connecting to mongodb server
connect.then(
  (db) => console.log(`connected successfully to the server`),
  (err) => console.log(err)
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const auth = function(req, res , next) {
  const authHeader = req.headers.authorization

  if(!authHeader){
    res.setHeader('WWW-Authenticate', 'Basic')
    const err = new Error(`you are not authenticated`)
    err.status = 401
    return next(err)
  }
  const authentication = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':')
  const user = authentication[0]
  const password = authentication[1]
  if(user === 'admin' && password === 'password'){
      next()
  }
  else{
      res.setHeader('WWW-Authenticate', 'Basic')
      const err = new Error(`you are not authenticated`)
      err.status = 401
      return next(err)
  }
}

app.use(auth)
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/dishes', dishRouter)
app.use('/leaders', leaderRouter)
app.use('/promotions', promotionRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
