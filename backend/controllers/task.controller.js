const express = require("express");
const router = express.Router();

const Task = require("../models/task.model");
const User = require("../models/user.model");

// @desc get all Tasks
// @route GET /api/tasks
// @access Private (Admin: all, User:assigned)
const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id, ...filter })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
    }

    // Add completed todoCHecklist scount to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckList.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completeTodoCount: completedCount };
      })
    );

    // status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "in progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
      statusSummary: {
        all: allTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc get task by ID
// @route GET /api/tasks/:id
// @access Private (Admin: all, User:assigned)
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo createdBy",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc create a new task
// @route POST /api/tasks
// @access Private (Admin Only)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      todoCheckList,
      attachments,
    } = req.body;
    if (!title || !description || !status || !assignedTo || !dueDate) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        message: "AssignedTo must be an array of userIDs and not empty",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      todoCheckList,
      attachments,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc update a task
// @route PUT /api/tasks/:id
// @access Private (Admin: all, User:assigned)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({
          message: "AssignedTo must be an array of userIDs and not empty",
        });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc delete a task
// @route DELETE /api/tasks/:id
// @access Private (Admin Only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc update task status
// @route PUT /api/tasks/:id/status
// @access Private (Admin: all, User:assigned)
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssigned =
      Array.isArray(task.assignedTo) &&
      task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
      );

    // const isAssigned = task.assignedTo.some(
    //   (userId) => userId.toString() === req.user._id.toString()
    // );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized" });
    }

    task.status = req.body.status?.toLowerCase() || task.status;

    if (task.status === "completed") {
      task.todoCheckList.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    const updatedTask = await task.save();
    res
      .status(200)
      .json({ message: "Task status updated successfully", updatedTask });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc update task checklist
// @route PUT /api/tasks/:id/todo
// @access Private (Admin: all, User:assigned)
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoCheckList } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const isAssigned =
      Array.isArray(task.assignedTo) &&
      task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized" });
    }

    task.todoCheckList = todoCheckList; //replace with updated checklist

    // auto-update progress based on completed items
    const completedCount = task.todoCheckList.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoCheckList.length;
    task.progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

    // Auto-mark task as completed if all tasks are checked
    if (task.progress === 100) {
      task.status = "completed";
    } else if (task.progress > 0) {
      task.status = "in progress";
    } else {
      task.status = "pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo createdBy",
      "name email"
    );

    res.status(200).json({
      message: "Task checklist updated successfully",
      progress: updatedTask.progress,
      updatedChecklist: updatedTask.todoCheckList,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc get dashboard data (Admin Only)
// @route GET /api/tasks/dashboard-data
// @access Private (Admin Only)
const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    // Ensure all possible statuses are included
    const taskStatuses = ["pending", "in progress", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "_").toLowerCase(); //Remove spaces for reponse keys
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks; //Add total count to distribution

    // Ensure all possible priorities are included
    const taskPriorities = ["low", "medium", "high"];
    const taskPriorityDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityDistributionRaw.find((item) => item._id === priority)
          ?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title description status priority dueDate createdAt")

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc get user dashboard data (User Only)
// @route GET /api/tasks/user-dashboard-data
// @access Private (User Only)
const getUserDashboardData = async (req, res) => {
  try {
    const userID = req.user._id;

    // fetch all tasks assigned to the user
    const totalTasks = await Task.countDocuments({ assignedTo: userID });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userID,
      status: "pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userID,
      status: "completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userID,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    // tas disribution status
    const taskStatuses = ["pending", "in progress", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      {$match: { assignedTo: userID }},
      {$group: {_id: "$status",count: { $sum: 1 }}},
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "_").toLowerCase(); //Remove spaces for reponse keys
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks; //Add total count to distribution

    const taskPriorities = ["low", "medium", "high"]; 
    const taskPriorityLevelsRaw = await Task.aggregate([
      {$match: { assignedTo: userID }},
      {$group: {_id: "$priority",count: { $sum: 1 }}},
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
      taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // fetch recent 10 tasks assigned to the user
    const recentTasks = await Task.find({ assignedTo: userID })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title description status priority dueDate createdAt")

    res.status(200).json({
      message: "User dashboard data fetched successfully",
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });



  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc get user tasks (User Only)
// @route GET /api/tasks/user-tasks
// @access Private (User Only)
const getUserTasks = async (req, res) => {
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
  getUserTasks,
};
// This code defines the task management routes and their corresponding controller functions.
