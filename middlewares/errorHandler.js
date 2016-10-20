if (process.env.NODE_ENV === 'development') {
  exports.default = (err, req, res, next) => {
    res.status(err.status || 500)
      .json({
        message: err.message,
        error: err,
      });
  };
} else {
  exports.default = (err, req, res, next) => {
    res.status(err.status || 500)
      .json({
        message: err.message,
        error: {},
      });
  };
}

module.exports = exports.default;
