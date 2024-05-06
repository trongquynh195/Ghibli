const express = require('express');
const router = express.Router();

const genreController = require('../app/controllers/GenreController');

router.get('/:slug', genreController.show);

module.exports = router;