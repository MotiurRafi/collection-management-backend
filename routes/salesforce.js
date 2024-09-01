const express = require('express');
const router = express.Router();
const salesforceController = require('../controllers/salesforceController');
const salesforceAuth = require('../middlewares/salesforceAuth');

router.get('/auth-url', salesforceController.getAuthorizationUrl);
router.post('/register', salesforceController.createAccountAndContact);
router.post('/token', salesforceAuth.getSalesforceToken);

module.exports = router;
