const Task = require("../models/task.model");
const User = require("../models/user.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc Get all users (admin only)
// @route GET /api/user
// @access Private (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    // Add task count to each user
    const usersWithTaskCount = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });
        const totalTasks = pendingTasks + completedTasks; // Fixed length issue
        return {
          ...user._doc,
          totalTasks: totalTasks,
          pendingTasks: pendingTasks,
          completedTasks: completedTasks,
        };
      })
    );

    res.status(200).json(usersWithTaskCount);
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user by id
// @route GET /api/user/:id
// @access Private
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById:", error.message);
    res.status(500).json({ message: error.message });
  }
};



// console.log({ getAllUsers, getUserById, deleteUser });

module.exports = {
  getAllUsers,
  getUserById,
};
