const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const { requireAuth } = require('../middleware/auth.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);

module.exports = router;