
const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountController')
const auth = require('../middlewares/auth');

router.post('/', auth.authenticated, controller.profile);

module.exports = router;