const path = require('path');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
// const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config');
const users = require('./routes/user.js');

const app = express();
const router = new express.Router();

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/**
 * Register API routes.
 */
router.use('/users', users);
app.use('/api/v1', router);

/**
 * Define error handlers.
 */
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
      .json({
        message: err.message,
        error: err,
      });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500)
    .json({
      message: err.message,
      error: {},
    });
});

/**
 * Configure MongoDB connection.
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);

module.exports = app;
