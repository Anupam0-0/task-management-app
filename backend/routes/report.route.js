const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middlware');
const {exportTasksReport, exportUsersReport} = require('../controllers/report.controller')

const router = express.Router();

router.get('/export/tasks', exportTasksReport); // Export all tasks as an excel file (Admin Only)
router.get('/export/users', protect, adminOnly, exportUsersReport); // Export user-task as an excel file (Admin Only)


module.exports = router;