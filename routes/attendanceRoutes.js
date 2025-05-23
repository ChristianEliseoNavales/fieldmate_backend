const express = require('express');
const router = express.Router();
const { 
    getTodayAttendance, 
    timeIn, 
    timeOut, 
    submitAttendance, 
    getCompanyAttendances, 
    approveAttendance, 
    denyAttendance,
    getAllAttendance
} = require('../controller/attendanceController');

router.get('/today', getTodayAttendance);
router.post('/timein', timeIn);
router.put('/timeout/:id', timeOut);
router.put('/submit/:id', submitAttendance);
router.get('/company', getCompanyAttendances);
router.put('/approve/:id', approveAttendance);
router.put('/deny/:id', denyAttendance);
router.get('/', getAllAttendance);

module.exports = router;
