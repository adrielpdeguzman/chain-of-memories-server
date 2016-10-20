const app = require('express');
const config = require('../config');
const auth = require('./auth.js');
const users = require('./user.js');
const journals = require('./journal.js');

const router = new app.Router();
const prefix = config.apiPrefix;

router.use('/auth', auth);

router.use(`${prefix}/users`, users);
router.use(`${prefix}/journals`, journals);

module.exports = router;
