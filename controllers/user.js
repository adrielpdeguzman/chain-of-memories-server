const sanitize = require('sanitize-html');
const User = require('../models/user');

module.exports = {
  /**
   * Get all users.
   */
  index(req, res, next) {
    User.find().exec((err, users) => {
      if (err) {
        return next(err);
      }

      return res.json({ users });
    });
  },

  /**
   * Create a new user.
   */
  create(req, res, next) {
    const newUser = new User();

    newUser.username = sanitize(req.body.username);
    newUser.password = sanitize(req.body.password);
    newUser.email = sanitize(req.body.email);
    newUser.name = sanitize(req.body.name);

    newUser.save((err, user) => {
      if (err) {
        return next(err);
      }

      return res.status(201).json({ user });
    });
  },

  /**
   * Read a single user.
   */
  read(req, res, next) {
    User.findById(req.params.id).exec((err, user) => {
      if (err || !user) {
        return next(err);
      }

      return res.json({ user });
    });
  },

  /**
   * Update a single user.
   */
  update(req, res, next) {
    const payload = {
      password: sanitize(req.body.password),
      email: sanitize(req.body.email),
      name: sanitize(req.body.name),
    };

    User.findByIdAndUpdate(req.params.id, payload, { new: true }).exec((err, user) => {
      if (err || !user) {
        return next(err);
      }

      return res.json({ user });
    });
  },

  /**
   * Delete a single user.
   */
  delete(req, res, next) {
    User.findByIdAndRemove(req.params.id).exec((err, user) => {
      if (err || !user) {
        return next(err);
      }

      return res.json({ user });
    });
  },

  /**
   * Read the authenticated user.
   */
  me(req, res, next) {
    User.findById(req.sub).exec((err, user) => {
      if (err) {
        return next(err);
      }

      return res.json({ user });
    });
  },
};
