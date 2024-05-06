const express = require('express');
const router = express.Router();

const accountController = require('../app/controllers/accountController');

router.get('/info', accountController.info);
router.post('/update', accountController.update);

module.exports = router;