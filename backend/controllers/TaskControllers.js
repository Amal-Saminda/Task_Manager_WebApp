const Task = require("../models/Task");


const getTasks = async(req,res) => {
  try {
    
    const{status} = req.query;
    let filter = {};

    if(status) {
      filter.status = status;
    }

    let tasks;

    if(req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }else{
      tasks = await Task.find({...filter, assignedTo: req.user._id}).populate(
        "assignedTo",
        "name email profileImageUrl"
    );
    }

    //Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = (task.todoCheckList || []).filter(
          (item) => item.completed
        ).length;
        return {...task._doc, completedTodoCount: completedCount};
      })
    );

    //status summary count
    const allTasks = await Task.countDocuments(
      req.user.role == "admin" ? {} : {assignedTo: req.user._id}
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
    });

    const inProgressTasks = await Task.countDocuments({
        ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
    })

    const completedTasks = await Task.countDocuments({
        ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
    });

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

    if(!task) return res.json(404).json({message: "Task Not Found"});

    res.json(task);
    
  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const getUserDashboardData = async(req,res) => {
  try {

    const userId = req.user._id; //pnly fetch data logged-in user

    //fetch statics for user specifc tasks

    const totalTask = await Task.countDocuments({assignedTo: userId});
    const pendingTasks = await Task.countDocuments({ assignedTo:userId ,status: "pending"});
    const completedTasks = await Task.countDocuments({assignedTo: userId ,status: "completed"});
    const overDueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: {$ne: "completed"},
      dueDate: {$lt: new Date()},
    });

    const taskstatuses = ["pending" , "In Progress" , "Completed"];
    const taskDistributionRow = await Task.aggregate([
      {
        $match: {
          assignedTo: userId
        }
      },
     
      {
        $group: {
          _id: "$status",
          count: {$sum: 1},
        },
      },
    ]);

      const taskDistribution = taskstatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g,"");
      acc[formattedKey] =
      taskDistributionRow.find((item) => item._id === status)?.count || 0;

      return acc;
    }, {});

        const taskpriority = ["Low" , "Medium" , "High"];
    const taskpriorityLevelRow = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1},
        },
      },
    ]);

    const taskpriorityLevel = taskpriority.reduce((acc, priority) => {
      acc[priority] = 
      taskpriorityLevelRow.find((item) => item._id === priority)?.count || 0;
      return acc;
    },{})

    const recentTasks = await Task.find({assignedTo: userId})
    .sort({ createdAt: -1})
    .limit(10)
    .select("title status priority dueDate createAt");

    res.status(200).json({statistics: {totalTask,pendingTasks,overDueTasks},
    charts:{
      taskDistribution,
      taskpriorityLevel,
    },
    recentTasks,
    });


    
  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const getDashboardData = async(req,res) => {
  try {
    //Fetch statics
    const totalTask = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({status: "pending"});
    const completedTasks = await Task.countDocuments({status: "completed"});
    const overDueTasks = await Task.countDocuments({
      status:{$ne: "completed"},
      dueDate: {$lt: new Date()},
    });

    const taskstatuses = ["pending" , "In Progress" , "Completed"];
    const taskDistributionRow = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: {$sum: 1},
        },
      },
    ]);

    const taskDistribution = taskstatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g,"");
      acc[formattedKey] =
      taskDistributionRow.find((item) => item._id === status)?.count || 0;

      return acc;
    }, {});

    taskDistribution["All"] = totalTask; //add total count of distribution

    const taskpriority = ["Low" , "Medium" , "High"];
    const taskpriorityLevelRow = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1},
        },
      },
    ]);

    const taskpriorityLevel = taskpriority.reduce((acc, priority) => {
      acc[priority] = 
      taskpriorityLevelRow.find((item) => item._id === priority)?.count || 0;
      return acc;
    },{})

    //Fetch 10 recent tasks
    const recentTasks = await Task.find()
    .sort({ createdAt: -1})
    .limit(10)
    .select("title status priority dueDate createAt");

    res.status(200).json({statistics: {totalTask,pendingTasks,overDueTasks},
    charts:{
      taskDistribution,
      taskpriorityLevel,
    },
    recentTasks,
    });
    
  } catch (error) {
     console.log("Dashboard Error:", error);
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}

const updateTask = async(req,res) => {
  try {

    const task = await Task.findById(req.params.id);
    if(!task)res.status(404).json({message: "Task Not Found"});

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
    task.attachments = req.body.attachments || task.attachments;

    if(req.body.assignedTo) {
      if(!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({message: "assignedTo must be an array of user IDs"});
      }

      task.assignedTo = req.body.assignedTo;
    }

    const updateTask = await task.save();
    res.json({message: "Task update succesfullt", updateTask})


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
    if(!task)res.status(404).json({message: "Task Not Found"});

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if(!isAssigned && req.user.role !== "admin"){
      return res.status(403).json({message: "Not authorized!"});
    }

    task.status = req.body.status || task.status;

    if(task.status === "Completed") {
      task.todoCheckList = task.todoCheckList || [];
      task.todoCheckList.forEach((item) => (item.completed =true));
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
        const task = await Task.findById(req.params.id);
    if(!task)res.status(404).json({message: "Task Not Found"});

    if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({message: "Not authorize update the checklist"})
    
  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  

  // task.todoCheckList = todoCheckList;

  //Auto-update progress based on checklist 
  const completedCount = (task.todoCheckList || []).filter(
    (item) => item.completed
  ).length;

  const totalItems = Task.todoCheckList.length;
  Task.progress = 
  totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  //Auto mark task as completed if all items are checked
  if(task.progress === 100){
    Task.status = "Completed";
  }else if (Task.progress > 0) {
    Task.status = "In Progress"
  }else{
    Task.status = "Pending";
  }

  await Task.save();
  const updateTask = await Task.findById(req.params.id).populate(
          "assignedTo",
      "name email profileImageUrl"

  );
}

  res.json({message: "Task checklist updated", Task:updateTask});

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
        createBy: req.user._id,
        todoCheckList,
        attachments
      });
      res.status(201).json({message: "Task created successfully", Task})
    
  } catch (error) {
     res.status(500).json({message: "Server Error" , error:error.message})
  }
}


module.exports = { getTasks,getTaskById,createTask,getUserDashboardData,getDashboardData,getTaskById,updateTask,deleteTask,updateTaskStatus,updateTaskCheckList };