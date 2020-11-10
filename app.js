require('./shared/constants');

var createError = require('http-errors'),
  express = require('express'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  env = require('node-env-file'), // .env file
  app = express();

env(__dirname + '/.env');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes/records'));

// Catch 404 and forward to error handler
app.use(function (request, response, next) {
  next(createError(404));
});

// Error handler
app.use(function (error, request, response, next) {
  // Set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  // Render the error page
  response.status(error.status || 500);
  response.send(error);
});

module.exports = app;
