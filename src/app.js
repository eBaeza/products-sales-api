import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import expressJwt from 'express-jwt'

// Config
import config from '../config/app.json'

// Routes modules
import index from './routes/index'
import auth from './routes/auth'
import users from './routes/users'
import products from './routes/products'

const app = express()

// View engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
// Logger
app.use(logger('dev'))
// Parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// Enable CORS
app.use(cors())

/**
 * Globals Middlewares
 */
// Set database from url
app.use('/:database', (req, res, next) => {
  req.db = req.params.database || 'v1'
  next()
})

// Authentication middleware
app.use(expressJwt({ secret: config.secret }).unless({
  path: [
    '/',
    /^\/.*\/auth/,
    { url: /^\/.*\/users/, methods: ['POST'] },
  ],
}))

/**
 * Define Routes
 */
app.use('/', index)
app.use('/:database/auth', auth)
app.use('/:database/users', users)
app.use('/:database/products', products)

/**
 * Handler errors
 */

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // Handle error Authentication
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid authentication.' })
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  }
})

export default app
