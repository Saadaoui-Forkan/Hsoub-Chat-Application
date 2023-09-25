const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

// Register
router.post('/register', controller.register);

module.exports = router;