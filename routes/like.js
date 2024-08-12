const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { userAuth } = require('../middlewares/authMiddleware');

router.post('/toggle-like/:itemId', userAuth, likeController.toggleLike);
router.get('/get-item-like/:itemId', likeController.getLikes);

module.exports = router;
