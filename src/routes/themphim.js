const express = require('express');
const router = express.Router();

const themphimController = require('../app/controllers/ThemphimController');

router.get('/create', themphimController.create);
router.post('/store', themphimController.store);
router.get('/:slug/update', themphimController.update);
router.put('/:slug', themphimController.putupdate);
router.get('/', themphimController.Danhsach);
module.exports = router;