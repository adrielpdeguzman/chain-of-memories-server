const express = require('express');
const controller = require('../controllers/auth.js');

const router = new express.Router();

router.post('/login', controller.login);

module.exports = router;
