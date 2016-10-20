const uuid = require('node-uuid');

const config = {
  dev: {
    anniversaryDate: '2013-12-07',
    apiPrefix: '/api/v1',
    mongoUri: 'mongodb://localhost/chainofmemories',
    jwtSecret: 'fefd78cf-614c-4b25-acff-4241f8dca800',
  },

  prod: {
    jwtSecret: uuid.v4(),
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports = config.prod;
} else {
  module.exports = config.dev;
}
