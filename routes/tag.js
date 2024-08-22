const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/search-tag/', tagController.searchTag);

module.exports = router;