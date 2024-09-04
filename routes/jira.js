const express = require('express');
const router = express.Router();
const jiraController = require('../controllers/jiraController');

router.post('/create-ticket', jiraController.createJiraTicket);
router.get('/get-user-ticket', jiraController.getUserTickets);

module.exports = router;
