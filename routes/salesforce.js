const express = require('express');
const router = express.Router();
const salesforceController = require('../controllers/salesforceController');
const salesforceAuth = require('../middlewares/salesforceAuth');

router.get('/auth-url', salesforceAuth.getAuthorizationUrl);
router.post('/token', salesforceAuth.getSalesforceToken);
router.post('/register', salesforceController.createAccountAndContact);

module.exports = router;
