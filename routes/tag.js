const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/get-tag/', tagController.searchTag);

module.exports = router;