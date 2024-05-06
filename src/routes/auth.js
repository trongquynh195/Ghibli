const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUsser);
router.get('/', authController.login);

module.exports = router;