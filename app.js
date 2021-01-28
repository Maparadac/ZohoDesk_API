require('./shared/globals');

var createError = require('http-errors'),
  express = require('express'),
  cookieParser = require('cookie-parser'),
  env = require('node-env-file'),
  bodyParser = require('body-parser'), // .env file
  app = express(),
  cors = require('cors'),
  path = require('path'),
  favicon = require('serve-favicon');

// Development environment
if (!process.env.NODE_ENV)
  env(__dirname + '/.env');

app.use(cors())

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())

// Object keyed by the cookie names
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Template engine configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.use('/', require('./routes/index'));
app.use('/crm', require('./routes/crm/records'));

// Catch 404 and forward to error handler
app.use(function (request, response, next) {
  next(createError(404));
});

// Error handler
app.use(function (error, request, response, next) {
  // Render the error page
  response.status(error.status || 500);
  response.render('error', { error, message: error.message });
});

module.exports = app;
