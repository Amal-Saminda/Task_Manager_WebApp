const Task = require("../models/Task");
const User = require("../models/User");
const excelJs = require("exceljs");

const exportTasksReport = async(req,res) => {
  try{

          const tasks = await Task.find().populate("assignedTo" , "name email");

      const workbook = new excelJs.Workbook();
      const worksheet = workbook.addWorksheet("Tasks Report");

      worksheet.columns - [
        {header: "Task ID" , key: "_id" , width: 25},
        {header: "Title" , key: "Title" , width: 30},
        {header: "Description" , key: "description" , width: 50},
        {header: "Priority" , key: "Priority" , width: 15},
        {header: "Status" , key: "Status" , width: 20},
        {header: "Due Date" , key: "DueDate" , width: 20},
        {header: "Assigned To" , key: "assignedTo" , width: 30},
      ];

      tasks.forEach((task) => {
        const assignedTo = task.assignedTo
        .map((user) => `$(user.name) (${user.email})`)
        .join(", ");
        worksheet.addRow({
          _id: task._id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate.toISOString().split("T")[0],
          assignedTo: assignedTo || "unassigned",
        });
      });

      res.setHeader(
        "content-type",
        "application/vnd.openxmlformats-officedocument.spredsheetml.sheet"
      );
      
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="task.reports.xlsx"'
      );

  }catch(error){
  res.status(500).json({message: "Error Exporting Tasks" , error: error.message})
  }
};


const exportUserReport = async(req,res) => {
    try{
      const users = await User.find().select("name email_id").lean();
      const userTasks = await Task.find().populate(
        "assignedTo",
        "name email _id"
      );

      const userTaskMap ={};
      users.forEach((user) => {
        userTaskMap[user._id] = {
          name: user.name ,
          email: user.email,
          taskCount: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
        };
      });

      userTasks.forEach((task) => {
        if(task.assignedTo) {
          task.assignedTo.forEach((assignedUser) => {
            if (userTaskMap[assignedUser._id]) {
              userTaskMap[assignedUser._id].taskCount += 1;
              if(task.status === "pending"){
                userTaskMap[assignedUser._id].taskCount += 1;
              }else if (task.status === "In Progress") {
                 userTaskMap[assignedUser._id].taskCount += 1;
              }else if(task.status === "completed") {
                 userTaskMap[assignedUser._id].taskCount += 1;
              }
            }    
            
          });
        }
      });

      const workbook = new excelJs.Workbook();
      const worksheet = workbook.addWorksheet("User Task Report");

      worksheet.columns = [
        {header: "User Name", key: "name" , width: 30},
        {header: "Email", key: "email" , width: 40},
        {header: "Total Assigned Tasks", key: "taskCount" , width: 20},
        {header: "Pending Tasks", key: "pendingTasks" , width: 20},
        {
          header: "In Progress Tasks", 
          key: "InProgressTasks" , 
          width: 30
        },
        {header: "Completed Tasks", key: "completedTasks" , width: 30},
      ];

      object.values(userTaskMap).forEach((user) => {
        worksheet.addRow(user);
      });

            res.setHeader(
        "content-type",
        "application/vnd.openxmlformats-officedocument.spredsheetml.sheet"
      );
      
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="task.reports.xlsx"'
      );

  }catch(error){
  res.status(500).json({message: "Error Exporting Tasks" , error: error.message})
  }

}

module.exports = {exportTasksReport , exportUserReport};