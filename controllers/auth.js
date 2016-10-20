const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

module.exports = {
  login(req, res, next) {
    User.findOne({ username: req.body.username }).exec((err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      user.verifyPassword(req.body.password).then((success) => {
        if (success) {
          const jwtBody = {
            sub: user.id,
            iss: req.headers.host,
          };

          const token = jwt.sign(jwtBody, config.jwtSecret, {
            expiresIn: '30 days',
          });

          return res.json({ token });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
      });
    });
  },
};
