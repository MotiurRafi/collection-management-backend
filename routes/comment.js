const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { userAuth } = require('../middlewares/authMiddleware');

router.post('/add-comment/:itemId', userAuth, commentController.createComment);
router.get('/get-item-comment/:itemId', commentController.getItemComments);
router.put('/update-comment/:id', userAuth, commentController.updateComment);
router.delete('/remove-comment/:id', userAuth, commentController.deleteComment);

module.exports = router;