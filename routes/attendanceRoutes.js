const express = require('express');
const router = express.Router();
const { getTodayAttendance, timeIn, timeOut, submitAttendance } = require('../controller/attendanceController');

router.get('/today', getTodayAttendance);
router.post('/timein', timeIn);
router.put('/timeout/:id', timeOut);
router.put('/submit/:id', submitAttendance);

module.exports = router;
