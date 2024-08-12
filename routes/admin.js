const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/authMiddleware');

router.get('/get-admin', adminAuth, adminController.getAllAdmin);
router.put('/promote/:id', adminAuth, adminController.promoteToAdmin);
router.put('/demote/:id', adminAuth, adminController.demoteToUser);
router.put('/block/:id', adminAuth, adminController.blockAdmin);
router.put('/unblock/:id', adminAuth, adminController.unblockAdmin);

module.exports = router;
