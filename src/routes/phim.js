const express = require('express');
const router = express.Router();

const phimController = require('../app/controllers/PhimController');

router.get('/:slug/:tap', phimController.xemphim);
router.get('/:slug', phimController.show);

module.exports = router;