const app = require('express');
const auth = require('./auth.js');
const users = require('./user.js');
const config = require('../config');

const router = new app.Router();
const prefix = config.apiPrefix;

router.use('/auth', auth);

router.use(`${prefix}/users`, users);

module.exports = router;
