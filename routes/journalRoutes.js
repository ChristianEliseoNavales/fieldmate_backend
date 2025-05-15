const express = require('express');
const router = express.Router();
const { createJournal, getTodayJournal, getUserByEmail, getJournalsByCompany } = require('../controller/journalController');

router.post('/', createJournal);
router.get('/', getUserByEmail); 
router.get('/today', getTodayJournal);
router.get('/company', getJournalsByCompany);

module.exports = router;
