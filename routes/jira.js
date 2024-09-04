const express = require('express');
const router = express.Router();
const jiraController = require('../controllers/jiraController');

router.post('/create-ticket', jiraController.createJiraTicket);

module.exports = router;
