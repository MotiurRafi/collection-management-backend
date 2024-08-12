const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { adminAuth } = require('../middlewares/authMiddleware');

router.get('/get-user/:userId', userController.getUser)
router.get('/search-user/', adminAuth, userController.searchUser)

module.exports = router;