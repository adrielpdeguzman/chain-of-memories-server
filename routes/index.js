const app = require('express');
const auth = require('./auth.js');
const users = require('./user.js');
const config = require('../config');
const journals = require('./journal.js');

const router = new app.Router();
const prefix = config.apiPrefix;

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Chain of Memories', csrfToken: req.csrfToken() });
});
router.use('/auth', auth);

router.use(`${prefix}/users`, users);
router.use(`${prefix}/journals`, journals);

module.exports = router;
