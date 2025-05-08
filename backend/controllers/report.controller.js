const Task = require("../models/task.model");
const User = require("../models/user.model");
const excelJS = require("exceljs");

// @desc EXport all tasks as an excel file
// @route GET /api/reports/export/tasks
// @access Private (Admin Only)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
    if (!tasks) {
      return res.status(404).json({ message: "No tasks found" });
    }

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "id", width: 20 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
      { header: "Created By", key: "createdBy", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ")
        : task.assignedTo?.name || "Unassigned";
      const createdBy = task.createdBy?.name || "Unknown";
      worksheet.addRow({
        id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toLocaleDateString().split("T")[0],
        assignedTo: assignedTo,
        createdBy: createdBy,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks-report.xlsx"
    );
    workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Export user-task as an excel file
// @route GET /api/reports/export/users
// @access Private (Admin Only)
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find({}).select("name email _id").lean();
    const userTasks = await Task.find({}).populate(
      "assignedTo",
      "name email _id"
    );

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        tasks: [],
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (Array.isArray(task.assignedTo)) { // Ensure assignedTo is an array
        task.assignedTo.forEach((assignedUser) => {
            if (userTaskMap[assignedUser._id]) {
                userTaskMap[assignedUser._id].taskCount += 1;
                // userTaskMap[assignedUser._id].tasks.push(task.title);
                if (task.status === "pending") {
                    userTaskMap[assignedUser._id].pendingTasks += 1;
                } else if (task.status === "in progress") {
                    userTaskMap[assignedUser._id].inProgressTasks += 1;
                } else if (task.status === "completed") {
                    userTaskMap[assignedUser._id].completedTasks += 1;
                }
            }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      { header: "User ID", key: "_id", width: 20 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Total Tasks", key: "taskCount", width: 15 },
      { header: "Pending Tasks", key: "pendingTasks", width: 15 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
        worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users-report.xlsx"
    );
    
    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};
