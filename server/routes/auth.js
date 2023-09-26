const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

// Register
router.post('/register', controller.register);
// Login
router.post('/', controller.login);

module.exports = router;