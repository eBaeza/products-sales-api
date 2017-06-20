const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon');
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressJwt = require('express-jwt')

const config = require('../config/app.json')

const index = require('./routes/index')
const auth = require('./routes/auth')
const users = require('./routes/users')
const products = require('./routes/products')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
app.use('/:database', expressJwt({ secret: config.secret }))
// Handle error Authentication
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') res.status(401).json({ error: 'Invalid authentication.' })
})

// Set database from url
app.use('/:database', (req, res, next) => {
  req.db = req.params.database || 'v1'
  next()
})

app.use('/', index)
app.use('/:database/auth', auth)
app.use('/:database/users', users)
app.use('/:database/products', products)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
