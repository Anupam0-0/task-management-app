const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth.middlware');
const { 
    getAllUsers, 
    getUserById, 
} = require('../controllers/user.controller');


// user management routes
router.get('/', protect, adminOnly, getAllUsers); // Get all users (admin only)
router.get('/:id', protect, getUserById); // Get user by ID

module.exports = router;