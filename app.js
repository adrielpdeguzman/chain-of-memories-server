const path = require('path');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
// const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config');
const routes = require('./routes');
const middlewares = require('./middlewares');

/**
 * Configure express.
 */
const app = express();
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public'));

/**
 * Register API routes and middlewares.
 */
app.use(config.apiPrefix, middlewares.isAuthenticated);
app.use(middlewares.csrf);
app.use(routes);
app.use(middlewares.notFound);
app.use(middlewares.default);

/**
 * Configure MongoDB connection.
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);

module.exports = app;
