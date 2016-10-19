const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

module.exports = {
  isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
          return next(err);
        }

        req.user = decoded;

        return next();
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
  },
};
