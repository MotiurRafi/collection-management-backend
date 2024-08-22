const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { userAuth } = require('../middlewares/authMiddleware');

router.post('/create-item/', userAuth, itemController.createItem);
router.get('/get-item/:id', itemController.getItem);
router.get('/get-collection-item/:collectionId', itemController.getCollectionItems);
router.get('/get-tag-item/:tag', itemController.getTagItems);
router.get('/get-all-item/', itemController.getAllItem);
router.get('/get-latest-item', itemController.getLatestItems);
router.put('/update-item/:id', userAuth, itemController.updateItem);
router.delete('/delete-item/:id', userAuth, itemController.deleteItem);

module.exports = router;