const app = require('express');
const errorHandler = require('./errorHandler');
const isAuthenticated = require('./auth').isAuthenticated;

module.exports = {
  errorHandler,
  isAuthenticated,
};
