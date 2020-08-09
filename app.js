const createError = require('http-errors')
const express = require('express')
const path = require('path')
// const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const authenticate = require('./authenticate')
const config = require('./config')

const connect = mongoose.connect(config.mongoUrl, { 
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
const uploadRouter = require('./routes/uploadRoute')
const faveoriteRouter = require('./routes/favoriteRoute')


const app = express()
 
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

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

//initialize passport
app.use(passport.initialize())

//completly public Routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use(express.static(path.join(__dirname, 'public')))

//authentication required Routes
app.use('/dishes', dishRouter)
app.use('/leaders', leaderRouter)
app.use('/promotions', promotionRouter)
app.use('/imageUpload', uploadRouter) 
app.use('/favorites', faveoriteRouter)

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