/**
 * Error 404 handler.
 */
module.exports = {
  notFound(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  },

  default(err, req, res, next) {
    const errorObject = {
      message: err.message,
      error: err,
    };

    if (process.env.NODE_ENV === 'production') {
      delete errorObject.error;
    }

    res.status(err.status || 500)
      .json(errorObject);
  },
};
