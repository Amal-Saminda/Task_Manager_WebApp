const Task = require("../models/Task");

const TASK_STATUSES = ["Pending", "In Progress", "Completed"];
const TASK_PRIORITIES = ["Low", "Medium", "High"];

//helper: is the logged-in user allowed to work on this task
const canAccessTask = (task, user) => {
  if (user.role === "admin") return true;

  return task.assignedTo.some(
    (assigned) => (assigned._id || assigned).toString() === user._id.toString()
  );
};

//helper: progress + status are always calculated from the checklist
const applyChecklistProgress = (task) => {
  const totalItems = (task.todoCheckList || []).length;
  const completedCount = (task.todoCheckList || []).filter(
    (item) => item.completed
  ).length;

  task.progress =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  if (task.progress === 100) {
    task.status = "Completed";
  } else if (task.progress > 0) {
    task.status = "In Progress";
  } else {
    task.status = "Pending";
  }
};

//helper: dashboard numbers (admin = all tasks, member = only own tasks)
const buildDashboardData = async (filter = {}) => {
  const totalTask = await Task.countDocuments(filter);
  const pendingTasks = await Task.countDocuments({...filter, status: "Pending"});
  const inProgressTasks = await Task.countDocuments({...filter, status: "In Progress"});
  const completedTasks = await Task.countDocuments({...filter, status: "Completed"});
  const overDueTasks = await Task.countDocuments({
    ...filter,
    status: {$ne: "Completed"},
    dueDate: {$lt: new Date()},
  });

  const taskDistributionRow = await Task.aggregate([
    { $match: filter },
    { $group: { _id: "$status", count: {$sum: 1} } },
  ]);

  const taskDistribution = TASK_STATUSES.reduce((acc, status) => {
    const formattedKey = status.replace(/\s+/g,"");
    acc[formattedKey] =
      taskDistributionRow.find((item) => item._id === status)?.count || 0;

    return acc;
  }, {});

  taskDistribution["All"] = totalTask; //add total count of distribution

  const taskpriorityLevelRow = await Task.aggregate([
    { $match: filter },
    { $group: { _id: "$priority", count: {$sum: 1} } },
  ]);

  const taskpriorityLevel = TASK_PRIORITIES.reduce((acc, priority) => {
    acc[priority] =
      taskpriorityLevelRow.find((item) => item._id === priority)?.count || 0;

    return acc;
  }, {});

  //Fetch 10 recent tasks
  const recentTasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt");

  return {
    statistics: {totalTask, pendingTasks, inProgressTasks, completedTasks, overDueTasks},
    charts: {taskDistribution, taskpriorityLevel},
    recentTasks,
  };
};


const getTasks = async(req,res) => {
  try {

    const{status} = req.query;

    //admin sees all tasks, member sees only assigned tasks
    const baseFilter = req.user.role === "admin" ? {} : {assignedTo: req.user._id};

    let filter = {...baseFilter};

    if(status) {
      filter.status = status;
    }

    let tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email profileImageUrl");

    //Add completed todoChecklist count to each task
    tasks = tasks.map((task) => {
      const completedCount = (task.todoCheckList || []).filter(
        (item) => item.completed
      ).length;
      return {...task.toObject(), completedTodoCount: completedCount};
    });

    //status summary count (not affected by the status filter)
    const allTasks = await Task.countDocuments(baseFilter);
    const pendingTasks = await Task.countDocuments({...baseFilter, status: "Pending"});
    const inProgressTasks = await Task.countDocuments({...baseFilter, status: "In Progress"});
    const completedTasks = await Task.countDocuments({...baseFilter, status: "Completed"});

    res.json({
      tasks,
      statusSummary:{
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });

  } catch (error) {
    res.status(500).json({message: "Server Error" , error:error.message})
  }
};

const getTaskById = async(req,res) => {
  try {

    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if(!task) return res.status(404).json({message: "Task Not Found"});

    if(!canAccessTask(task, req.user)) {
      return res.status(403).json({message: "Not authorized to view this task"});
    }

    res.json(task);

  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const getUserDashboardData = async(req,res) => {
  try {

    //only fetch data of the logged-in user
    const data = await buildDashboardData({assignedTo: req.user._id});

    res.status(200).json(data);

  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const getDashboardData = async(req,res) => {
  try {

    const data = await buildDashboardData();

    res.status(200).json(data);

  } catch (error) {
     console.log("Dashboard Error:", error);
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const updateTask = async(req,res) => {
  try {

    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({message: "Task Not Found"});

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.attachments = req.body.attachments || task.attachments;

    if(req.body.todoCheckList) {
      task.todoCheckList = req.body.todoCheckList;
      applyChecklistProgress(task);
    }

    if(req.body.assignedTo) {
      if(!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({message: "assignedTo must be an array of user IDs"});
      }

      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({message: "Task updated successfully", updatedTask})


  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const deleteTask = async(req,res) => {
  try {

    const task = await Task.findById(req.params.id);

    if(!task) return res.status(404).json({message: "Task Not Found"});

    await task.deleteOne();
    res.json({message: "Task deleted succesfully"});

  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const updateTaskStatus = async(req,res) => {
  try {

    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({message: "Task Not Found"});

    if(!canAccessTask(task, req.user)){
      return res.status(403).json({message: "Not authorized!"});
    }

    if(req.body.status && !TASK_STATUSES.includes(req.body.status)) {
      return res.status(400).json({message: "Invalid status"});
    }

    task.status = req.body.status || task.status;

    if(task.status === "Completed") {
      task.todoCheckList.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({message: "Task status updated",task});

  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const updateTaskCheckList = async(req,res) => {
  try {

    const { todoCheckList } = req.body;

    if(!Array.isArray(todoCheckList)) {
      return res.status(400).json({message: "todoCheckList must be an array"});
    }

    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({message: "Task Not Found"});

    if(!canAccessTask(task, req.user)) {
      return res.status(403).json({message: "Not authorized to update the checklist"});
    }

    task.todoCheckList = todoCheckList;

    //Auto-update progress and status based on checklist
    applyChecklistProgress(task);

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({message: "Task checklist updated", task: updatedTask});

  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const createTask = async(req,res) => {
  try {
      const{
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        attachments,
        todoCheckList,
      } = req.body

      if(!title || !dueDate) {
        return res.status(400).json({message: "Title and due date are required"});
      }

      if(!Array.isArray(assignedTo)) {
        return res
        .status(400).json({message: "assignedTo must be an array of user IDs"})
      }

      const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        createdBy: req.user._id,
        todoCheckList,
        attachments
      });

      res.status(201).json({message: "Task created successfully", task})

  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}


module.exports = { getTasks,getTaskById,createTask,getUserDashboardData,getDashboardData,updateTask,deleteTask,updateTaskStatus,updateTaskCheckList };
