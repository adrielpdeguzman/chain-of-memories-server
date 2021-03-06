const express = require('express');
const controller = require('../controllers/user.js');

const router = new express.Router();

router.get('/me', controller.me);
router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:id', controller.read);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
