const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// POST /api/attendance
router.post('/', attendanceController.post);

// GET /api/attendance/history/:userID
router.get('/history/:userID', attendanceController.history);

// GET /api/attendance/summary/:userID
router.get('/summary/:userID', attendanceController.summary);

// POST /api/attendance/analysis
router.post('/analysis', attendanceController.analysis);

module.exports = router;
