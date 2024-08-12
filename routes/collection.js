const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const upload = require('../middlewares/multer-config');
const { userAuth } = require('../middlewares/authMiddleware');

router.post('/create-collection/:userId', upload.single('image'), userAuth, collectionController.createCollection);
router.get('/get-collection/:id', userAuth, collectionController.getCollection);
router.get('/get-user-collection/:userId', userAuth, collectionController.getUserCollections);
router.put('/update-collection/:id', upload.single('image'), userAuth, collectionController.updateCollection);
router.delete('/delete-collection/:id', userAuth, collectionController.deleteCollection);

module.exports = router;
