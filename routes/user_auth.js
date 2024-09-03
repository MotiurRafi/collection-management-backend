const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/authMiddleware')

router.get('/', userAuth, (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        salesforceStatus: req.user.salesforceStatus,
    });
})
module.exports = router;
