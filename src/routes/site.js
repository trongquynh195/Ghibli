const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

// router.get('/api/genre/action', siteController.search);
router.get('/logout', siteController.logout);
router.get('/', siteController.home);


module.exports = router;