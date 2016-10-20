const errorHandler = require('./errorHandler');
const csrf = require('csurf')({ cookie: true });
const isAuthenticated = require('./auth').isAuthenticated;

module.exports = {
  csrf,
  isAuthenticated,
  default: errorHandler.default,
  notFound: errorHandler.notFound,
};
