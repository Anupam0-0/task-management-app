const express = require('express');
const {protect, adminOnly} = require('../middleware/authMiddleware');
const { get } = require('mongoose');

const router = express.Router();

// Task Management Routes
router.get('/dashboard-data', protect, getDashboardData);
router.get('/user-dashboard-data', protect, getUserDashboardData);
router.get('/', protect, getAllTasks); // Get all tasks (Admin: all, User:assigned)
router.get('/:id', protect, getTaskById); // Get task by ID (Admin: all, User:assigned)
router.post('/', protect,adminOnly, createTask); // Create a new task (Admin Only)
router.put('/:id', protect, updateTask); // Update a task details (Admin: all, User:assigned)
router.delete('/:id', protect, adminOnly,deleteTask); // Delete a task (Admin Only)
router.get('/:id/status', protect, updateTaskStatus); // Update task status (Admin: all, User:assigned)
router.post('/:id/todo', protect, updateTaskChecklist); // Update task checklist

module.exports = router;