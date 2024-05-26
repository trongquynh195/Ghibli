const express = require('express');
const router = express.Router();

const searchController = require('../app/controllers/searchController');

router.post('/loc', searchController.loc);
router.get('/loc', searchController.loc);
router.post('/', searchController.show);

module.exports = router;