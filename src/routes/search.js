const express = require('express');
const router = express.Router();

const searchController = require('../app/controllers/searchController');

router.post('/', searchController.show);

module.exports = router;