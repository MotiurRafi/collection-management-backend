const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const upload = require('../middlewares/multer-config');
const { userAuth } = require('../middlewares/authMiddleware');

router.post('/create-collection/:userId', upload.single('image'), userAuth, collectionController.createCollection);
router.get('/get-collection/:id', collectionController.getCollection);
router.get('/get-all-collection/',collectionController.getAllCollection);
router.get('/get-user-collection/:userId', collectionController.getUserCollections);
router.get('/get-category-collection/:category', collectionController.getCategoryCollections);
router.put('/update-collection/:id', upload.single('image'), userAuth, collectionController.updateCollection);
router.delete('/delete-collection/:id', userAuth, collectionController.deleteCollection);

module.exports = router;
