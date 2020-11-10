require('./shared/constants');

var createError = require('http-errors'),
  express = require('express'),
  cookieParser = require('cookie-parser'),
  env = require('node-env-file'), // .env file
  app = express();

env(__dirname + '/.env');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/crm', require('./routes/records'));

// Catch 404 and forward to error handler
app.use(function (request, response, next) {
  next(createError(404));
});

// Error handler
app.use(function (error, request, response, next) {
  // Render the error page
  response.status(error.status || 500);
  response.send(error);
});

module.exports = app;
