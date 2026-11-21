const Task = require("../models/Task");
const User = require("../models/User");
const excelJs = require("exceljs");

const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    // Define Excel columns
    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 40 },
    ];

    // Add task data to Excel rows
    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        ?.map((user) => `${user.name} (${user.email})`)
        .join(", ");

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        assignedTo: assignedTo || "Unassigned",
      });
    });

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2E8F0" },
    };

    // Send Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="task_details.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Export Tasks Report Error:", error);

    res.status(500).json({
      message: "Error exporting tasks report",
      error: error.message,
    });
  }
};


const exportUserReport = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email")
      .lean();

    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

    const userTaskMap = {};

    // Create initial report data for each user
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    // Calculate task counts
    userTasks.forEach((task) => {
      task.assignedTo?.forEach((assignedUser) => {
        const user = userTaskMap[assignedUser._id];

        if (!user) return;

        user.taskCount += 1;

        if (task.status === "pending") {
          user.pendingTasks += 1;
        } else if (task.status === "In Progress") {
          user.inProgressTasks += 1;
        } else if (task.status === "Completed") {
          user.completedTasks += 1;
        }
      });
    });

    // Create Excel workbook
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 22 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 22 },
      { header: "Completed Tasks", key: "completedTasks", width: 22 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2E8F0" },
    };

    // Send Excel file to frontend
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="user_details.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Export User Report Error:", error);

    res.status(500).json({
      message: "Error exporting user report",
      error: error.message,
    });
  }
};

module.exports = {exportTasksReport , exportUserReport};