const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

module.exports = {
  login({ body }, res, next) {
    User.findOne({ username: body.username }).exec((err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      user.verifyPassword(body.password).then((success) => {
        if (success) {
          const userEntity = {
            username: user.username,
            email: user.email,
            name: user.name,
            id: user.id,
          };

          const token = jwt.sign(userEntity, config.jwtSecret);

          return res.json({ token });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
      });
    });
  },
};
