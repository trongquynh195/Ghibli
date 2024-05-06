const express = require('express');
const router = express.Router();

const seasonController = require('../app/controllers/SeasonController');

router.get('/:slug', seasonController.show);

module.exports = router;